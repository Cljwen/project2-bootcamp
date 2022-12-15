import React from "react";
import { ProfileForm } from "../forms/3.ProfileForm";

import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";

import { LoginForm } from "../forms/2.LoginForm";
import { useNavigate } from "react-router-dom";

import PetsIcon from "@mui/icons-material/Pets";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { SignUpForm } from "../forms/1.SignUpForm";

export function SignUpPage() {
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
      <SignUpForm />
    </div>
  );
}
