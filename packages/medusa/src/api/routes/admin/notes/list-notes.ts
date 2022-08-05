import { IsNumber, IsOptional, IsString } from "class-validator"

import NoteService from "../../../../services/note"
import { Type } from "class-transformer"
import { selector } from "../../../../types/note"
import { validator } from "../../../../utils/validator"

/**
 * @oas [get] /notes
 * operationId: "GetNotes"
 * summary: "List Notes"
 * x-authenticated: true
 * description: "Retrieves a list of notes"
 * parameters:
 *   - (query) limit=50 {number} The number of notes to get
 *   - (query) offset=0 {number} The offset at which to get notes
 *   - (query) resource_id {string} The ID which the notes belongs to
 * tags:
 *   - Note
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             notes:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/note"
 *             count:
 *               type: integer
 *               description: The total number of items available
 *             offset:
 *               type: integer
 *               description: The number of items skipped before these items
 *             limit:
 *               type: integer
 *               description: The number of items per page
 */
export default async (req, res) => {
  const validated = await validator(AdminGetNotesParams, req.query)

  const selector: selector = {}

  if (validated.resource_id) {
    selector.resource_id = validated.resource_id
  }

  const noteService: NoteService = req.scope.resolve("noteService")
  const notes = await noteService.list(selector, {
    take: validated.limit,
    skip: validated.offset,
    relations: ["author"],
  })

  res.status(200).json({
    notes,
    count: notes.length,
    offset: validated.offset,
    limit: validated.limit,
  })
}

export class AdminGetNotesParams {
  @IsString()
  @IsOptional()
  resource_id?: string

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit = 50

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset = 0
}
