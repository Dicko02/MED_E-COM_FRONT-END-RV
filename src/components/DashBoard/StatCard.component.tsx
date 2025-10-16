import type React from "react"
import { Card, CardContent, Typography, Box } from "@mui/material"

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  color?: string
}

function StatCard({ title, value, icon, color = "#1976d2" }: StatCardProps) {
  return (
    <Card
      style={{
        background: "linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)",
        border: "1px solid #333",
        borderRadius: "12px",
        height: "100%",
      }}
    >
      <CardContent>
        <Box style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box>
            <Typography
              variant="body2"
              style={{
                color: "#888",
                fontSize: "14px",
                marginBottom: "8px",
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="h4"
              style={{
                color: "#fff",
                fontWeight: "bold",
              }}
            >
              {value}
            </Typography>
          </Box>
          <Box
            style={{
              backgroundColor: color,
              borderRadius: "50%",
              width: "60px",
              height: "60px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default StatCard
