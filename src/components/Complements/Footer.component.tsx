function Footer() {
  return (
    <footer
      style={{
        padding: "1.5rem",
        backgroundColor: "#333",
        color: "white",
        textAlign: "center",
        marginTop: "auto",
      }}
    >
      <p style={{ margin: 0 }}>© {new Date().getFullYear()} E-Commerce - Tous droits réservés</p>
    </footer>
  )
}

export default Footer
