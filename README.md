# Food Recipe — Backend

A REST API for the Food Recipe application, built with Node.js, Express, TypeScript, Prisma, and PostgreSQL.

This repository manages authentication, recipe data, saved recipes, and user accounts. The React frontend is maintained in a separate repository.

<!-- Replace these placeholders with your actual links before publishing. -->
- **Frontend repository:** https://github.com/MinThantMaung/Food-recipe
- **Production API base URL:** https://food-recipe-api-fsi8.onrender.com/api/v1/

## Features

- Email registration with OTP verification.
- Email and password login, plus Google sign-in.
- Password recovery through email verification codes.
- Access and refresh tokens stored in HTTP-only cookies.
- Recipe list and detail retrieval.
- Related ingredients, cooking steps, categories, and cuisine data.
- Saved-recipe management.
- User profile and account updates.
- Database models for recipe ratings and reviews.
- Request validation, CORS configuration, and rate limiting.

## Tech Stack

| Purpose | Technology |
| --- | --- |
| Runtime and language | Node.js, TypeScript |
| HTTP framework | Express |
| Database | PostgreSQL |
| ORM and migrations | Prisma |
| Middleware | Helmet, CORS, cookie-parser, compression, Morgan |
| Images | AWS S3, Amazon CloudFront |
| Hosting | Render |
| Email | Resend; migration to Brevo in progress |
| Planned caching and jobs | Redis, ioredis, BullMQ |

## Getting Started

### Prerequisites

- Node.js and npm compatible with this repository's package configuration.
- A PostgreSQL database.
- Google authentication configuration for Google sign-in.
- Credentials for the active transactional email provider.
- AWS credentials only if running backend features that access S3.

Redis is needed when enabling the caching and worker implementation.

### Installation

Clone this repository, open its directory, and install dependencies:

```bash
npm install
```

### Environment Configuration

Create a local `.env` file. Use the repository's `.env.example`, if available, and match the exact variable names expected by the source.

| Configuration | Purpose |
| --- | --- |
| Database connection | PostgreSQL access through Prisma |
| Token secrets | Signing and verifying authentication tokens |
| Frontend origin | CORS allowlist and related application configuration |
| Google authentication settings | Verifying Google sign-in |
| Email credentials and sender | Sending registration and password-reset codes |
| Server port | Local or hosted HTTP listener |
| AWS settings, where required | Accessing image storage |
| Redis settings, when enabled | Cache and queue connectivity |

The email migration branch plans to use:

```dotenv
BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=your_verified_sender_email@example.com
```

These settings apply after the Brevo service is implemented. Retain the active provider's configuration until the migration has been tested.

Do not commit real secrets or expose backend credentials through frontend environment variables.

### Database Setup

After configuring a development database connection:

```bash
npx prisma generate
npx prisma migrate deploy
```

This generates the Prisma client and applies committed migrations. Run the repository's seed command, if configured, to load initial data.

When changing the schema during development, create a migration against a development database:

```bash
npx prisma migrate dev --name describe_your_change
```

### Start the Server

List the available scripts:

```bash
npm run
```

If the repository defines a `dev` script:

```bash
npm run dev
```

The local API base URL used during development is:

```text
http://localhost:4000/api/v1
```

Use the configured server port if it differs. Run the frontend separately and allow its origin in the backend CORS configuration.

## API Examples

The following recipe endpoints have been implemented. Authentication and user route definitions in the source are the reference for the rest of the API.

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/v1/recipes` | Retrieve recipe card data |
| GET | `/api/v1/recipes/:id` | Retrieve recipe details and related content |

```bash
curl http://localhost:4000/api/v1/recipes
curl http://localhost:4000/api/v1/recipes/1
```

Replace `1` with an existing recipe ID.

## Data Model

| Model | Responsibility |
| --- | --- |
| User | Account, profile, and authentication data |
| Otp | Verification codes and verification state |
| Recipe | Recipe metadata, servings, and cuisine association |
| Country / Continent | Geographic and cuisine organization |
| Ingredient / RecipeIngredient | Ingredients, quantities, units, and preparation notes |
| RecipeStep | Ordered cooking instructions |
| Category / RecipeCategory | Recipe classification |
| Review | User ratings and comments |
| SavedRecipe | User bookmarks |

Unique user–recipe constraints prevent duplicate bookmarks and multiple review records for the same user and recipe.

## Authentication and Email

The backend handles token verification and sets HTTP-only authentication cookies. Protected operations should use the authenticated user identity established by middleware.

OTP registration and password recovery use a backend email service. The migration from Resend to Brevo is in progress; successful delivery and error handling still need to be verified before treating the migration as complete.

## Testing

Backend automated test coverage is planned. Use the test command defined in `package.json` once a backend test runner and suite are configured.

Priority scenarios:

- Registration and OTP verification, including invalid and expired codes.
- Login, token refresh, and unauthorized requests.
- Password recovery and account updates.
- Saved-recipe creation and removal.
- Recipe retrieval and missing recipe IDs.
- Email provider failures.

## Deployment

The backend is hosted on Render.

- Configure backend environment variables and database access.
- Use the build and start commands defined by the repository.
- Generate the Prisma client and apply committed migrations during the deployment workflow.
- Ensure the server listens on the hosting platform's configured port.
- Allow the deployed frontend origin in CORS.
- Configure authentication cookies for the actual frontend and backend domains.
- Verify Google sign-in and email delivery against the deployed application.

## Roadmap

- [ ] Complete and verify the Brevo email migration.
- [ ] Expand backend automated test coverage.
- [ ] Complete Redis caching for recipe reads.
- [ ] Implement and verify BullMQ cache invalidation after recipe changes.
- [ ] Add admin endpoints for recipe management.

## Author

**Min Thant Maung**

[LinkedIn](https://www.linkedin.com/in/min-thant-maung-2620411b3/)

## License

Refer to the repository's `LICENSE` file, if present, for usage terms.
