import React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import { EmailLogo } from './EmailLogo';

interface VerificationEmailProps {
  otp: string;
  isPasswordReset?: boolean;
}

export const VerificationEmail = ({
  otp,
  isPasswordReset = false,
}: VerificationEmailProps) => {
  const title = isPasswordReset
    ? 'Reset Your Password'
    : 'Verify Your Email Address';

  const previewText = isPasswordReset
    ? 'Use this code to reset your password'
    : 'Use this code to verify your email address';

  const instruction = isPasswordReset
    ? 'To reset your password, enter this verification code in the password reset page:'
    : 'To verify your email address, enter this verification code in the verification page:';

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <div style={logoContainer}>
            <EmailLogo size="md" />
          </div>
          <Heading style={heading}>{title}</Heading>
          <Section style={section}>
            <Text style={text}>{instruction}</Text>
            <Text style={codeContainer}>{otp}</Text>
            <Text style={text}>
              If you didn&apos;t request this, you can safely ignore this email.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: '#f9f9f9',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '580px',
};

const logoContainer = {
  textAlign: 'center' as const,
  marginBottom: '16px',
};

const heading = {
  fontSize: '24px',
  letterSpacing: '-0.5px',
  lineHeight: '1.3',
  fontWeight: '400',
  color: '#484848',
  padding: '17px 0 0',
};

const section = {
  padding: '24px',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  border: '1px solid #e0e0e0',
};

const text = {
  margin: '0 0 16px',
  fontSize: '16px',
  lineHeight: '1.4',
  color: '#484848',
};

const codeContainer = {
  margin: '24px 0',
  padding: '16px',
  backgroundColor: '#f2f3f3',
  borderRadius: '4px',
  fontFamily: 'monospace',
  fontSize: '24px',
  textAlign: 'center' as const,
  letterSpacing: '2px',
  fontWeight: 'bold',
  color: '#4a51e5',
};

export default VerificationEmail;
