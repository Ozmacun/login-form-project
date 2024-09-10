import React, { useState } from "react";
import { Form, FormGroup, Label, Input, Button, Alert } from "reactstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const initialForm = {
  email: "",
  password: "",
  terms: false,
};

const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

const isStrongPassword = (password) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[^\s]{8,}$/;
  return passwordRegex.test(password);
};

export default function Login() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newErrors = [];

    if (!isValidEmail(form.email)) {
      newErrors.push("Geçerli bir email adresi girin.");
    }

    if (!isStrongPassword(form.password)) {
      newErrors.push(
        "Parola en az 8 karakter uzunluğunda olmalı, en az bir büyük harf, bir küçük harf, bir rakam ve bir özel karakter içermelidir."
      );
    }

    if (!form.terms) {
      newErrors.push("Şartları kabul etmelisiniz.");
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors([]);

    try {
      const response = await axios.get("https://6540a96145bedb25bfc247b4.mockapi.io/api/login");
      const user = response.data.find(
        (item) => item.password === form.password && item.email === form.email
      );
      if (user) {
        setForm(initialForm);
        navigate("/success");
      } else {
        setErrors(["Geçersiz email veya parola."]);
      }
    } catch (error) {
      console.error("API isteği sırasında bir hata oluştu:", error);
      setErrors(["Sunucu hatası. Lütfen daha sonra tekrar deneyin."]);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {errors.length > 0 && (
        <Alert color="danger">
          {errors.map((err, index) => (
            <div key={index}>{err}</div>
          ))}
        </Alert>
      )}
      <FormGroup>
        <Label for="email">Email</Label>
        <Input
          id="email"
          name="email"
          placeholder="Enter your email"
          type="email"
          onChange={handleChange}
          value={form.email}
        />
      </FormGroup>
      <FormGroup>
        <Label for="password">Password</Label>
        <Input
          id="password"
          name="password"
          placeholder="Enter your password"
          type="password"
          onChange={handleChange}
          value={form.password}
        />
      </FormGroup>
      <FormGroup>
        <Input
          id="terms"
          name="terms"
          type="checkbox"
          checked={form.terms}
          onChange={handleChange}
        />
        <Label htmlFor="terms">
          I agree to terms of service and privacy policy
        </Label>
      </FormGroup>
      <FormGroup className="text-center p-4">
        <Button color="primary" disabled={!form.terms || errors.length > 0}>
          Sign In
        </Button>
      </FormGroup>
    </Form>
  );
}
