# ProyectoFinalProgBackendOtero
Proyecto Final Curso de Programacion Backend Coderhouse

API Rest para un ecommerce

Documentacion de API con swagger: https://proyectofinalprogbackendotero.onrender.com/api/docs

Deployed as Monorepo:

Backend deployed on Render: https://proyectofinalprogbackendotero.onrender.com/

Frontend deployed on Vercel: https://proyecto-final-prog-backend-otero.vercel.app/

## Endpoints Links
Products
* [POST /api/products](https://github.com/GuzH09/ProyectoFinalProgBackendOtero/tree/main?tab=readme-ov-file#post-apiproducts)
* [GET /api/products](https://github.com/GuzH09/ProyectoFinalProgBackendOtero/tree/main?tab=readme-ov-file#get-apiproducts)
* [GET /api/products/{pid}](https://github.com/GuzH09/ProyectoFinalProgBackendOtero/tree/main?tab=readme-ov-file#get-apiproductspid)
* [PUT /api/products/{pid}](https://github.com/GuzH09/ProyectoFinalProgBackendOtero/tree/main?tab=readme-ov-file#put-apiproductspid)
* [DELETE /api/products/{pid}](https://github.com/GuzH09/ProyectoFinalProgBackendOtero/tree/main?tab=readme-ov-file#delete-apiproductspid)

Carts
* [POST /api/carts](https://github.com/GuzH09/ProyectoFinalProgBackendOtero/tree/main?tab=readme-ov-file#post-apicarts)
* [GET /api/carts/{cid}](https://github.com/GuzH09/ProyectoFinalProgBackendOtero/tree/main?tab=readme-ov-file#get-apicartscid)
* [PUT /api/carts/{cid}](https://github.com/GuzH09/ProyectoFinalProgBackendOtero/tree/main?tab=readme-ov-file#put-apicartscid)
* [DELETE /api/carts/{cid}](https://github.com/GuzH09/ProyectoFinalProgBackendOtero/tree/main?tab=readme-ov-file#delete-apicartscid)
* [POST /api/carts/{cid}/purchase](https://github.com/GuzH09/ProyectoFinalProgBackendOtero/tree/main?tab=readme-ov-file#post-apicartscidpurchase)
* [POST /api/carts/{cid}/product/{pid}](https://github.com/GuzH09/ProyectoFinalProgBackendOtero/tree/main?tab=readme-ov-file#post-apicartscidproductpid)
* [PUT /api/carts/{cid}/product/{pid}](https://github.com/GuzH09/ProyectoFinalProgBackendOtero/tree/main?tab=readme-ov-file#put-apicartscidproductpid)
* [DELETE /api/carts/{cid}/product/{pid}/delete](https://github.com/GuzH09/ProyectoFinalProgBackendOtero/tree/main?tab=readme-ov-file#delete-apicartscidproductpiddelete)
---
## Endpoints

### Products

* #### GET /api/products
  Get all products with pagination, sorting, and query options
  ##### Parameters:
  * page: integer (default: 1) - Page number
  * limit: integer (default: 10) - Number of products per page
  * sort: string (enum: [asc, desc]) - Sort products by price
  * category: string - Filter products by category
  * stock: integer - Filter products by stock
  ##### Responses:
  * 200:
    * Description: A list of products
    * Content: application/json
    * Schema: JSON
      * "status": "success"
      * "payload": [Product Schema]
      * "totalPages": integer
      * "prevPage": integer
      * "nextPage": integer
      * "page": integer
      * "hasPrevPage": boolean
      * "hasNextPage": boolean
      * "prevLink": string
      * "nextLink": string
      * "isValid": boolean
  * 500:
    * Description: Server error
    * Content: application/json
    * Schema: JSON
      * "error": string

* #### POST /api/products
  Create a new product
  ##### Security:
  * cookieAuth
  ##### Request Body:
  * multipart/form-data
  * Schema: JSON
    * "title": "string"
    * "description": "string"
    * "code": "string"
    * "price": "number"
    * "stock": "integer"
    * "category": "string"
    * "thumbnails": ["string (binary)"]
  ##### Responses:
  * 201:
    * Description: Product created successfully
    * Content: application/json
    * Schema: JSON
      * Product Schema
  * 400:
    * Description: Bad request
    * Content: application/json
    * Schema: JSON
      * "error": "string"
  * 403:
    * Description: Forbidden
    * Content: application/json
    * Schema: JSON
      * "error": "string"
  ---
* #### GET /api/products/{pid}
  Get a product by ID
  ##### Parameters:
  * pid: string (required) - The product ID
  ##### Responses:
  * 200:
    * Description: Product retrieved successfully
    * Content: application/json
    * Schema: JSON
      * Product Schema
  * 400:
    * Description: Bad request
    * Content: application/json
    * Schema: JSON
      * "error": "string"

* #### PUT /api/products/{pid}
  Update an existing product by its ID
  ##### Security:
  * cookieAuth
  ##### Parameters:
  * pid: string (required) - The product ID
  ##### Request Body:
  * application/json
  * Schema: JSON
    * "title": "string"
    * "description": "string"
    * "code": "string"
    * "price": "number"
    * "stock": "integer"
    * "category": "string"
    * "thumbnails": ["string"]
  ##### Responses:
  * 201:
    * Description: Product updated successfully
    * Content: application/json
    * Schema: JSON
      * Product Schema
  * 400:
    * Description: Bad request
    * Content: application/json
    * Schema: JSON
      * "error": "string"
  * 403:
    * Description: Forbidden
    * Content: application/json
    * Schema: JSON
      * "error": "string"

* #### DELETE /api/products/{pid}
  Delete an existing product by its ID
  ##### Security:
  * cookieAuth
  ##### Parameters:
  * pid: string (required) - The product ID
  ##### Responses:
  * 201:
    * Description: Product deleted successfully
    * Content: application/json
    * Schema: JSON
      * Product Schema
  * 400:
    * Description: Bad request
    * Content: application/json
    * Schema: JSON
      * "error": "string"
  * 403:
    * Description: Forbidden
    * Content: application/json
    * Schema: JSON
      * "error": "string"
---
### Carts

* #### POST /api/carts
  Create a new empty cart
  ##### Security:
  * cookieAuth
  ##### Responses:
  * 201:
    * Description: Cart created successfully
    * Content: application/json
    * Schema: JSON
      * "success": boolean
      * "result": Cart Schema
  * 400:
    * Description: Bad request
    * Content: application/json
    * Schema: JSON
      * "error": "string"

* #### GET /api/carts/{cid}
  Get a cart by ID
  ##### Security:
  * cookieAuth
  ##### Parameters:
  * cid: string (required) - The cart ID
  ##### Responses:
  * 200:
    * Description: Cart retrieved successfully
    * Content: application/json
    * Schema: JSON
      * "carts": Cart Schema
  * 400:
    * Description: Bad request
    * Content: application/json
    * Schema: JSON
      * "error": "string"
* #### DELETE /api/carts/{cid}
  Delete all products from a cart by its ID
  ##### Security:
  * cookieAuth
  ##### Parameters:
  * cid: string (required) - The cart ID
  ##### Responses:
  * 200:
    * Description: Cart cleared successfully
    * Content: application/json
    * Schema: JSON
      * "carts": Cart Schema
  * 400:
    * Description: Bad request
    * Content: application/json
    * Schema: JSON
      * "error": "string"
* #### PUT /api/carts/{cid}
  Update products in a cart by its ID
  ##### Security:
  * cookieAuth
  ##### Parameters:
  * cid: string (required) - The cart ID
  ##### Request Body:
  * application/json
  * Schema: JSON
    * "products": [Product Schema]
  ##### Responses:
  * 200:
    * Description: Cart updated successfully
    * Content: application/json
    * Schema: JSON
      * "carts": Cart Schema
  * 400:
    * Description: Bad request
    * Content: application/json
    * Schema: JSON
      * "error": "string"
* #### POST /api/carts/{cid}/purchase
  Finish the purchase of a cart by its ID
  ##### Security:
  * cookieAuth
  ##### Parameters:
  * cid: string (required) - The cart ID
  ##### Responses:
  * 200:
    * Description: Purchase finished successfully
    * Content: application/json
    * Schema: JSON
      * "success": boolean
      * "result": Ticket Schema
  * 400:
    * Description: Bad request
    * Content: application/json
    * Schema: JSON
      * "error": "string"
* #### POST /api/carts/{cid}/product/{pid}
  Add a product to a cart by its ID
  ##### Security:
  * cookieAuth
  ##### Parameters:
  * cid: string (required) - The cart ID
  * pid: string (required) - The product ID
  ##### Responses:
  * 201:
    * Description: Product added to cart successfully
    * Content: application/json
    * Schema: JSON
      * "success": boolean
      * "result": Cart Schema
  * 400:
    * Description: Bad request
    * Content: application/json
    * Schema: JSON
      * "error": "string"
* #### PUT /api/carts/{cid}/product/{pid}
  Update the quantity of a product in a cart by its ID
  ##### Security:
  * cookieAuth
  ##### Parameters:
  * cid: string (required) - The cart ID
  * pid: string (required) - The product ID
  ##### Request Body:
  * application/json
  * Schema: JSON
    * "quantity": integer
  ##### Responses:
  * 200:
    * Description: Product quantity updated successfully
    * Content: application/json
    * Schema: JSON
      * "success": boolean
      * "result": Cart Schema
  * 400:
    * Description: Bad request
    * Content: application/json
    * Schema: JSON
      * "error": "string"
* #### DELETE /api/carts/{cid}/product/{pid}
  Remove a product from a cart by its ID
  ##### Security:
  * cookieAuth
  ##### Parameters:
  * cid: string (required) - The cart ID
  * pid: string (required) - The product ID
  ##### Responses:
  * 200:
    * Description: Product removed from cart successfully
    * Content: application/json
    * Schema: JSON
      * "success": boolean
      * "result": Cart Schema
  * 400:
    * Description: Bad request
    * Content: application/json
    * Schema: JSON
      * "error": "string"
