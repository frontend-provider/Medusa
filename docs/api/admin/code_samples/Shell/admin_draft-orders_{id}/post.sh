curl --location --request POST 'https://medusa-url.com/admin/draft-orders/{id}' \
--header 'Authorization: Bearer {api_token}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "user@example.com"
}'
