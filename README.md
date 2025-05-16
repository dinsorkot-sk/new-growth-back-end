This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:4000](http://localhost:4000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Routes

| Path                | Description             |
|---------------------|-------------------------|
| `/admin`            | Admin dashboard         |
| `/admission`        | Admission page          |
| `/courses`          | Course listing          |
| `/courses/[id]`     | Course details          |
| `/dashboard`        | User dashboard          |
| `/forum`            | Forum                   |
| `/gallery`          | Gallery                 |
| `/knowledge`        | Knowledge base          |
| `/login`            | Login page              |
| `/news`             | News listing            |
| `/news/[id]`        | News details            |

## Deployment

### Vercel

1. Push your repo to GitHub (or GitLab/Bitbucket).  
2. Import the project in Vercel.  
3. Add the same environment variables in Vercel's Dashboard.  
4. Vercel will automatically build & deploy your Next.js app.

### Self-Host

```bash
npm run build
npm run start
```

Your app will run on `http://localhost:3000` by default.

## Contributing

Contributions are very welcome!  

1. Fork the repository  
2. Create a feature branch (`git checkout -b feature/…`)  
3. Commit your changes (`git commit -m "feat: …"`)  
4. Push to your fork (`git push origin feature/…`)  
5. Open a Pull Request  

Please follow conventional commit style and ensure all lint checks pass.

## License

This project is released under the MIT License. See [LICENSE](./LICENSE) for details.
