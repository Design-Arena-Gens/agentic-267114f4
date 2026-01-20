export const metadata = {
  title: 'Диагностика Бизнес-Блоков',
  description: 'Найдите и устраните причины, которые мешают начать бизнес',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body style={{ margin: 0, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
