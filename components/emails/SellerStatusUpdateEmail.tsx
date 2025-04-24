import React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import EmailLogo from './EmailLogo';

interface SellerStatusUpdateEmailProps {
  userEmail: string;
  status: 'approved' | 'rejected';
  dashboardUrl: string;
  rejectionReason?: string;
}

export default function SellerStatusUpdateEmail({
  userEmail,
  status,
  dashboardUrl,
  rejectionReason,
}: SellerStatusUpdateEmailProps) {
  const previewText =
    status === 'approved'
      ? 'Your seller account has been approved!'
      : 'Update on your seller account application';

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <EmailLogo />
          <Heading style={h1}>
            {status === 'approved'
              ? 'Seller Account Approved'
              : 'Seller Account Update'}
          </Heading>

          {status === 'approved' ? (
            <>
              <Text style={text}>
                Congratulations! Your seller account has been approved. You can
                now create listings and start selling on our platform.
              </Text>
              <Text style={text}>
                Get started by visiting your dashboard and creating your first
                listing.
              </Text>
              <Section style={buttonContainer}>
                <Link style={button} href={dashboardUrl}>
                  Go to Dashboard
                </Link>
              </Section>
            </>
          ) : (
            <>
              <Text style={text}>
                We&apos;ve reviewed your seller account application and
                unfortunately, we are unable to approve it at this time.
              </Text>
              {rejectionReason && (
                <Text style={text}>
                  <strong>Reason:</strong> {rejectionReason}
                </Text>
              )}
              <Text style={text}>
                You can update your information and reapply by visiting your
                dashboard.
              </Text>
              <Section style={buttonContainer}>
                <Link style={button} href={dashboardUrl}>
                  Go to Dashboard
                </Link>
              </Section>
            </>
          )}

          <Hr style={hr} />
          <Text style={footer}>
            This email was sent to {userEmail}. If you have any questions,
            please contact our support team.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '580px',
  borderRadius: '5px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: '600',
  margin: '30px 0',
  padding: '0 48px',
  textAlign: 'center' as const,
};

const text = {
  color: '#444',
  fontSize: '16px',
  margin: '0 0 20px',
  padding: '0 48px',
  textAlign: 'left' as const,
  lineHeight: '1.5',
};

const buttonContainer = {
  padding: '0 48px',
  margin: '24px 0',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#4a51e5',
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  padding: '12px 24px',
  display: 'inline-block',
};

const hr = {
  borderColor: '#e1e5e8',
  margin: '32px 0 20px',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '22px',
  padding: '0 48px',
  textAlign: 'center' as const,
};
