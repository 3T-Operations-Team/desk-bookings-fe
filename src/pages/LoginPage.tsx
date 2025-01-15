import { Avatar } from "@mui/material";
import React, { useState } from "react";
import styled from "styled-components";
import { useAuth } from "../auth";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const { login } = useAuth();

  const handleEmailInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[a-zA-Z0-9.@]*$/.test(value)) {
      setEmail(value);
      setError("");
    } else {
      setError("Email can only contain letters, numbers, and dots");
    }
  };

  const handlePasswordInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailTrimmed = email.trim();
    if (!emailTrimmed) {
      setError("Email cannot be empty");
      return;
    }
    login(emailTrimmed, password);
  };

  return (
    <LoginContainer>
      <EmailInputForm onSubmit={handleSubmit}>
        <Avatar
          alt="Remy Sharp"
          src="login.png"
          sx={{ width: 300, height: 300 }}
        />
        <DeskBookingHeader>Desk Booking</DeskBookingHeader>
        <EmailFields>
          <EmailInputFields>
            <CustomInput
              type="text"
              id="email"
              value={email}
              onChange={handleEmailInputChange}
              placeholder="Email"
            />
          </EmailInputFields>
          <CustomInput
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordInputChange}
          />
          <ErrorLabel>{error}</ErrorLabel>
        </EmailFields>
        <SubmitButton type="submit">Login</SubmitButton>
      </EmailInputForm>
    </LoginContainer>
  );
};

export default LoginPage;

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f7f7f7;
`;

const EmailInputForm = styled.form`
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 300px;
`;

const DeskBookingHeader = styled.h2`
  text-align: center;
  margin: 30px;
`;

const EmailFields = styled.div`
  margin-bottom: 15px;
`;

const EmailInputFields = styled.div`
  display: flex;
  align-items: center;
`;

const CustomInput = styled.input`
  width: 92.7%;
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px 4px 4px 4px;
  outline: none;
  margin-top: 10px;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #51ac6d;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
`;

const ErrorLabel = styled.small`
  display: block;
  margin-top: 7px;
  color: red;
  height: 7px;
  font-size: 0.7em;
`;
