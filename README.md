# Colours of Zurich

This application is a visualization of the [Baumkataster](https://opendata.swiss/de/dataset/baumkataster) of the city of Zurich. It aims to provide a simple and intuitive way to explore the trees of Zurich and their characteristics.

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## Tech Stack

This project uses the following technologies:

- [Next.js](https://nextjs.org)
- [Drizzle](https://orm.drizzle.team/)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)
- [TypeScript](https://www.typescriptlang.org/)
- [Storybook](https://storybook.js.org/)
- [postgres](https://www.postgresql.org/)

## Getting Started

The development environment is built with [Docker](https://www.docker.com/). Make sure you have it installed before continuing.

To start the development environment, run:

```bash
  docker compose up
```

This will start the following services:

- [Postgres](https://www.postgresql.org/) on [http://localhost:5432](http://localhost:5432)

With the database running, you can now run the following commands:

```bash
  bun db:migrate
  bun db:push
  bun db:seed
```

This will create the necessary tables and seed the database with the data from the `db-data` folder.

Finally, you can start the Next.js application by running:

```bash
  bun dev
```

To stop the development environment, run:

```bash
  docker compose down
```
