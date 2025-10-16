interface HeaderProps {
  title: string
}

function Header({ title }: HeaderProps) {
  return (
    <header
      style={{
        padding: "1.5rem",
        backgroundColor: "#1976d2",
        color: "white",
        borderRadius: "8px",
        marginBottom: "2rem",
      }}
    >
      <h1 style={{ margin: 0, fontSize: "2rem", fontWeight: "bold" }}>{title}</h1>
    </header>
  )
}

export default Header
