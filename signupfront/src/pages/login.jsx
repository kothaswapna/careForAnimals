import {
  Container,
  Grid,
  Box,
  Typography,
  Stack,
  Link as MuiLink,
  FormControlLabel,
  Checkbox,
  Snackbar,
  Alert,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useForm, FormProvider } from "react-hook-form";
import { Link, Navigate } from "react-router-dom";
import { literal, object, string } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "../components/FormInput";
// @ts-ignore
import { ReactComponent as GoogleLogo } from "../assets/google.svg";
// @ts-ignore
import { ReactComponent as GitHubLogo } from "../assets/github.svg";
import styled from "@emotion/styled";
import axios from "axios";
import React, { useState } from "react";
import backendPath from "../utils/backendPath";

// 👇 Styled React Route Dom Link Component
export const LinkItem = styled(Link)`
  text-decoration: none;
  color: #3683dc;
  &:hover {
    text-decoration: underline;
    color: #5ea1b6;
  }
`;

// 👇 Styled Material UI Link Component
export const OauthMuiLink = styled(MuiLink)`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f6f7;
  border-radius: 1;
  padding: 0.6rem 0;
  column-gap: 1rem;
  text-decoration: none;
  color: #393e45;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background-color: #fff;
    box-shadow: 0 1px 13px 0 rgb(0 0 0 / 15%);
  }
`;

// 👇 Login Schema with Zod
const loginSchema = object({
  email: string().min(1, "Email is required").email("Email is invalid"),
  password: string()
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
  persistUser: literal(true).optional(),
});

const LoginPage = () => {
  // 👇 Default Values
  const defaultValues = {
    email: "",
    password: "",
  };

  // 👇 The object returned from useForm Hook
  const methods = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues,
  });

  // 👇 Submit Handler
  const onSubmitHandler = async (values) => {
    console.log(values);
    axios
      .post(backendPath+"/app/login", values)
      .then((response) => {
        // console.log(response);
        if (response.status === 200) {
          // console.log(response.data.token);
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.email));
          localStorage.setItem("user_id", response.data.user_id);

          setLoginSuccess(true);
        }
      })
      .catch((error) => {
        const response = error.response;

        if (response.status === 400) {
          setDoesnotUserExist(true);
        } else if (response.status === 409) {
          setPassowordsNotMatch(true);
        }
      });
  };
  const handleClose = () => {
    setDoesnotUserExist(false);
    setPassowordsNotMatch(false);
    setLoginSuccess(false);
  };

  const [doesnotUserExist, setDoesnotUserExist] = useState(false);
  const [passowordsNotMatch, setPassowordsNotMatch] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const userAuth = () => {
    axios
      .get(backendPath+"/app/isUserAuth", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        console.log(response);
      });
  };

  // 👇 JSX to be rendered
  return (
    <Container
      maxWidth={false}
      sx={{ height: "100vh", backgroundColor: { xs: "#fff", md: "#f4f4f4" } }}
    >
      <Snackbar
        open={doesnotUserExist}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity="warning"
          sx={{ width: "100%" }}
          variant="filled"
        >
          User does not Exist!
        </Alert>
      </Snackbar>
      <Snackbar
        open={loginSuccess}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity="success"
          sx={{ width: "100%" }}
          variant="filled"
        >
          Login Successfull!
        </Alert>
      </Snackbar>
      <Snackbar
        open={passowordsNotMatch}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity="error"
          sx={{ width: "100%" }}
          variant="filled"
        >
          Incorrect Password!
        </Alert>
      </Snackbar>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ width: "100%", height: "100%" }}
      >
        <Grid
          item
          sx={{ maxWidth: "70rem", width: "100%", backgroundColor: "#fff" }}
        >
          <FormProvider {...methods}>
            <Grid
              container
              sx={{
                boxShadow: { sm: "0 0 5px #ddd" },
                py: "6rem",
                px: "1rem",
              }}
            >
              <Grid
                item
                container
                justifyContent="space-between"
                rowSpacing={5}
                sx={{
                  maxWidth: { sm: "45rem" },
                  marginInline: "auto",
                }}
              >
                <Grid
                  item
                  xs={12}
                  sm={6}
                  sx={{ borderRight: { sm: "1px solid #ddd" } }}
                >
                  <Box
                    display="flex"
                    flexDirection="column"
                    component="form"
                    noValidate
                    autoComplete="off"
                    sx={{ paddingRight: { sm: "3rem" } }}
                    onSubmit={methods.handleSubmit(onSubmitHandler)}
                  >
                    <Typography
                      variant="h6"
                      component="h1"
                      sx={{ textAlign: "center", mb: "1.5rem" }}
                    >
                      Log into your account
                    </Typography>

                    <FormInput
                      label="Enter your email"
                      type="email"
                      name="email"
                      focused
                      required
                    />
                    <FormInput
                      type="password"
                      label="Password"
                      name="password"
                      required
                      focused
                    />

                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          aria-label="trust this device checkbox"
                          //   {...methods.register("persistUser")}
                        />
                      }
                      label={
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: "0.8rem",
                            fontWeight: 400,
                            color: "#5e5b5d",
                          }}
                        >
                          Trust this device
                        </Typography>
                      }
                    />

                    <LoadingButton
                      loading={false}
                      type="submit"
                      variant="contained"
                      sx={{
                        py: "0.8rem",
                        mt: 2,
                        width: "80%",
                        marginInline: "auto",
                      }}
                    >
                      Login
                    </LoadingButton>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant="h6"
                    component="p"
                    sx={{
                      paddingLeft: { sm: "3rem" },
                      mb: "1.5rem",
                      textAlign: "center",
                    }}
                  >
                    Log in with another provider:
                  </Typography>
                  <Box
                    display="flex"
                    flexDirection="column"
                    sx={{ paddingLeft: { sm: "3rem" }, rowGap: "1rem" }}
                  >
                    <OauthMuiLink href="">
                      <GoogleLogo style={{ height: "2rem" }} />
                      Google
                    </OauthMuiLink>
                    <OauthMuiLink href="">
                      <GitHubLogo style={{ height: "2rem" }} />
                      GitHub
                    </OauthMuiLink>
                  </Box>
                </Grid>
              </Grid>
              <Grid container justifyContent="center">
                <Stack sx={{ mt: "3rem", textAlign: "center" }}>
                  <Typography sx={{ fontSize: "0.9rem", mb: "1rem" }}>
                    Need an account?{" "}
                    <LinkItem to="/signup">Sign up here</LinkItem>
                  </Typography>
                  <Typography sx={{ fontSize: "0.9rem" }}>
                    Forgot your <LinkItem to="/forgot">password?</LinkItem>
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </FormProvider>
        </Grid>
      </Grid>
      {loginSuccess && <Navigate to="/" />}
    </Container>
  );
};

export default LoginPage;
