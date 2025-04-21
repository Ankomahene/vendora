import React from 'react';
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import { EmailLogo } from './EmailLogo';

interface WelcomeEmailProps {
  userEmail: string;
  dashboardUrl: string;
}

export const WelcomeEmail = ({
  userEmail,
  dashboardUrl,
}: WelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>
        Welcome to Vendora - Your New Marketplace Journey Begins!
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <div style={logoContainer}>
            <EmailLogo size="md" />
          </div>
          <Heading style={heading}>Welcome to Vendora!</Heading>
          <Section style={section}>
            <Text style={text}>Hi {userEmail.split('@')[0]},</Text>
            <Text style={text}>
              Thank you for joining Vendora, your new marketplace platform.
              We&apos;re excited to have you onboard!
            </Text>
            <Text style={text}>
              You can now start exploring our marketplace, find what you need,
              or even start selling your products and services.
            </Text>
            <Button style={button} href={dashboardUrl}>
              Go to Dashboard
            </Button>
            <Text style={text}>
              Need help getting started? Just reply to this email and our
              support team will assist you.
            </Text>
            <Text style={text}>
              Best regards,
              <br />
              The Vendora Team
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

const button = {
  backgroundColor: '#4a51e5',
  borderRadius: '4px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '100%',
  margin: '24px 0',
  padding: '12px',
};

export default WelcomeEmail;
