import { Application, PageEvent, ParameterType } from "typedoc";

export function load(app: Application) {
    app.options.addDeclaration({
        name: "frontmatterData",
        help: "An object of key-value pairs to be added to frontmatter",
        type: ParameterType.Mixed, // The default
        defaultValue: {},
        validate: (value: any) => {
          if (typeof value === 'string') {
            //decode it with JSON to check if it's an object
            value = JSON.parse(value);
          }

          if (!(typeof value === 'object' &&
          !Array.isArray(value) &&
          value !== null)) {
            throw new Error("Value should be an object")
          }
        }
    });

    app.options.addDeclaration({
      name: "pagesPattern",
      help: "A string of pages pattern. The pattern will be tested using RegExp to determine whether the frontmatterData will be added or not.",
      type: ParameterType.String,
      defaultValue: ""
    })

    app.renderer.on(PageEvent.END, (page: PageEvent) => {
        const patternStr: String | any = app.options.getValue("pagesPattern")
        const pattern: RegExp = new RegExp(patternStr)
        let frontmatterData: Object | any = app.options.getValue("frontmatterData")
        if (typeof frontmatterData === 'string') {
          frontmatterData = JSON.parse(frontmatterData);
        }
        const frontmatterDataEntries = Object.entries(frontmatterData)

        if (!frontmatterDataEntries.length || !pattern.test(page.filename)) {
          return;
        }
        
        let frontmatterStr = `---\n`

        for(const [key, value] of frontmatterDataEntries) {
          frontmatterStr += `${key}: ${value}\n`
        }
        
        frontmatterStr += `---\n\n`

        page.contents = frontmatterStr + page.contents
    });
}