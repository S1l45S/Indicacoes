import './globals.css';

export const metadata = {
  title: 'Indicações',
  description: 'Indiçaões de Filmes, Livros e Séries',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt">
      <head>
         <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"></link>
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
