---
description: Read this file to understand how to fetch data from an API in this project.
---
# Data Fetching Instructions
This docuument outlines the best practices and guidelines for fetching data in our next.js application. Adhering to these instructions will ensure consistency and maintainability across the codebase.

## 1. Use Server Components for Data Fetching
In Next.js, ALWAYS use Server Components for data fetching. This allows you to fetch data on the server side, improving performance and SEO. 

## 2. Data Fetching Methods
ALWAYS use the helper functions in teh /data directory to fetch data. NEVER fetch data directly in the components.

ALL HELPER FUNCTIONS IN THE /data directory should use Drizzle ORM for database interactions.

