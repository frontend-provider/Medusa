curl --location --request POST 'https://medusa-url.com/admin/orders/{id}/swaps/{swap_id}/shipments' \
--header 'Authorization: Bearer {api_token}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "fulfillment_id": "{fulfillment_id}"
}'
