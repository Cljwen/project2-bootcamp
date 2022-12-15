import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { LoginForm } from "../forms/2.LoginForm";

import PetsIcon from "@mui/icons-material/Pets";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useNavigate } from "react-router-dom";

export function LoginPage() {
  const navigate = useNavigate();
  return (
    <div>
      <Box>
        <Box
          sx={{
            background: "#00685b",
            display: "flex",
            justifyContent: "center",
            padding: "2rem",
            position: "sticky",
            top: 0,
          }}
        >
          <PetsIcon sx={{ color: "White" }} />
          <Typography
            variant="h6"
            color="white"
            sx={{ paddingLeft: "1rem", marginRight: "auto" }}
          >
            Need A Walk
          </Typography>
        </Box>
      </Box>
      <LoginForm />
    </div>
  );
}
