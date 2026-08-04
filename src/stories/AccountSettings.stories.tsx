import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { User, Shield, Bell, Info, Check, Smartphone, Key, QrCode, Upload } from 'lucide-react';

import { Alert, AlertTitle, AlertDescription } from '@/components/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/avatar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/breadcrumb';
import { Button } from '@/components/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/card';
import { Checkbox } from '@/components/checkbox';
import { FileUpload } from '@/components/file-upload';
import { Input } from '@/components/input';
import { OtpInput } from '@/components/otp-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/select';
import { Switch } from '@/components/switch';
import { Toaster, toast } from '@/components/toast';

interface AccountSettingsProps {
  initialSavedState?: boolean;
  initialValidationErrors?: boolean;
}

function AccountSettingsPage({
  initialSavedState = false,
  initialValidationErrors = false,
}: AccountSettingsProps) {
  // Profile Input States
  const [fullName, setFullName] = useState(initialValidationErrors ? '' : 'Alex Mercer');
  const [email, setEmail] = useState(
    initialValidationErrors ? 'invalid-email' : 'alex.mercer@sinhatsu.com',
  );
  const [jobTitle, setJobTitle] = useState(initialValidationErrors ? '' : 'Lead Product Designer');
  const [timezone, setTimezone] = useState('PST');

  // Avatar Upload Progressive State
  const [showAvatarUpload, setShowAvatarUpload] = useState(false);
  const [avatarFiles, setAvatarFiles] = useState<File[]>([]);

  // 2FA Progressive Security States
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [twoFactorMethod, setTwoFactorMethod] = useState<'authenticator' | 'sms' | 'hardware'>(
    'authenticator',
  );
  const [phoneNumber, setPhoneNumber] = useState('+1 (555) 019-2834');
  const [isVerificationSent, setIsVerificationSent] = useState(initialSavedState);
  const [otpCode, setOtpCode] = useState(initialSavedState ? '849201' : '');

  // Preference Toggle States
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [weeklyNewsletter, setWeeklyNewsletter] = useState(true);
  const [securityDigest, setSecurityDigest] = useState(true);
  const [isSaved, setIsSaved] = useState(initialSavedState);

  // Validation Checks
  const isNameInvalid = initialValidationErrors && !fullName;
  const isEmailInvalid = initialValidationErrors && !email.includes('@');
  const isJobTitleInvalid = initialValidationErrors && !jobTitle;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email.includes('@') || !jobTitle) {
      toast.error('Validation Error', {
        description: 'Please fix highlighted errors before saving.',
      });
      return;
    }
    setIsSaved(true);
    toast.success('Account settings saved.', {
      description: 'Your profile and security preferences have been updated.',
    });
  };

  const handleReset = () => {
    setFullName('Alex Mercer');
    setEmail('alex.mercer@sinhatsu.com');
    setJobTitle('Lead Product Designer');
    setTimezone('PST');
    setShowAvatarUpload(false);
    setAvatarFiles([]);
    setTwoFactorEnabled(true);
    setTwoFactorMethod('authenticator');
    setPhoneNumber('+1 (555) 019-2834');
    setIsVerificationSent(false);
    setOtpCode('');
    setEmailNotifications(true);
    setWeeklyNewsletter(true);
    setSecurityDigest(true);
    setIsSaved(false);
    toast.info('Form reset to default values.');
  };

  const handleSendVerificationCode = () => {
    if (twoFactorMethod === 'sms' && !phoneNumber) {
      toast.warning('Please enter a valid phone number.');
      return;
    }
    setIsVerificationSent(true);
    if (twoFactorMethod === 'sms') {
      toast.success(`Verification code sent to ${phoneNumber}`);
    } else if (twoFactorMethod === 'authenticator') {
      toast.success('Authenticator QR code generated.', {
        description: 'Scan code in your app and enter 6-digit PIN below.',
      });
    } else {
      toast.info('Security key challenge initiated.');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-10 font-sans antialiased">
      {/* Toast Viewport */}
      <Toaster />

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumb>
          <BreadcrumbList className="text-xs">
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Settings</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Profile & Security</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Page Header Banner */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                Account Settings
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your personal profile, security preferences, and email notifications.
              </p>
            </div>
            {isSaved && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-success/15 text-success border border-success/30">
                <Check className="size-3.5" />
                All changes saved
              </span>
            )}
          </div>

          {/* Info Banner */}
          <Alert variant="info" className="bg-primary/5 border-primary/20">
            <Info className="size-4 text-primary" />
            <AlertTitle className="text-xs font-bold text-foreground">Automatic Sync</AlertTitle>
            <AlertDescription className="text-xs text-muted-foreground">
              Unsaved changes will be updated automatically on save. You can reset anytime.
            </AlertDescription>
          </Alert>
        </div>

        {/* Main Settings Form */}
        <form onSubmit={handleSave} className="space-y-8">
          {/* Section 1: Profile Information */}
          <Card className="shadow-xs border-border">
            <CardHeader className="border-b border-border/60 pb-4">
              <div className="flex items-center gap-2">
                <User className="size-4 text-primary" />
                <CardTitle as="h2" className="text-base font-bold">
                  Profile Information
                </CardTitle>
              </div>
              <CardDescription className="text-xs">
                Update your avatar photo, personal details, and primary timezone.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Avatar Section with Progressive Change Photo Button */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-6 p-4 rounded-xl border border-border bg-card">
                <Avatar size="xl" className="size-20 border-2 border-primary/20 shrink-0">
                  {avatarFiles.length > 0 ? (
                    <AvatarImage src={URL.createObjectURL(avatarFiles[0])} alt="Uploaded avatar" />
                  ) : null}
                  <AvatarFallback className="font-extrabold text-lg bg-primary text-primary-foreground">
                    AM
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-1.5 flex-1">
                  <p className="text-sm font-semibold text-foreground">Profile Picture</p>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG, or WebP up to 5MB. Avatar fallback renders your initials.
                  </p>
                </div>

                <Button
                  type="button"
                  variant={showAvatarUpload ? 'secondary' : 'outline'}
                  size="sm"
                  className="shrink-0 text-xs"
                  onClick={() => setShowAvatarUpload((prev) => !prev)}
                >
                  <Upload className="size-3.5 mr-1.5" />
                  {showAvatarUpload ? 'Hide Upload' : 'Change Photo'}
                </Button>
              </div>

              {/* Revealed FileUpload Dropzone */}
              {showAvatarUpload && (
                <div className="p-4 rounded-xl border border-dashed border-primary/40 bg-primary/5 space-y-2">
                  <FileUpload
                    value={avatarFiles}
                    onValueChange={(files) => {
                      setAvatarFiles(files);
                      if (files.length > 0) {
                        toast.info(`Avatar staged: ${files[0].name}`);
                      }
                    }}
                    accept={{ 'image/*': ['.jpeg', '.png', '.webp'] }}
                    maxFiles={1}
                    preview
                    label="Drop avatar image file here or click to browse"
                    description="Drag & drop new profile photo"
                  />
                </div>
              )}

              {/* Form Input Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                <div className="space-y-2">
                  <label htmlFor="full-name" className="text-xs font-semibold text-foreground">
                    Full Name *
                  </label>
                  <Input
                    id="full-name"
                    placeholder="e.g. Alex Mercer"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      setIsSaved(false);
                    }}
                    invalid={isNameInvalid}
                    error={isNameInvalid ? 'Full Name is required' : undefined}
                    helperText={!isNameInvalid ? 'Your display name across workspace' : undefined}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email-address" className="text-xs font-semibold text-foreground">
                    Email Address *
                  </label>
                  <Input
                    id="email-address"
                    type="email"
                    placeholder="alex.mercer@sinhatsu.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setIsSaved(false);
                    }}
                    invalid={isEmailInvalid}
                    error={isEmailInvalid ? 'Please enter a valid email address' : undefined}
                    helperText={
                      !isEmailInvalid ? 'Used for account recovery and alerts' : undefined
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="job-title" className="text-xs font-semibold text-foreground">
                    Job Title *
                  </label>
                  <Input
                    id="job-title"
                    placeholder="e.g. Lead Product Designer"
                    value={jobTitle}
                    onChange={(e) => {
                      setJobTitle(e.target.value);
                      setIsSaved(false);
                    }}
                    invalid={isJobTitleInvalid}
                    error={isJobTitleInvalid ? 'Job Title is required' : undefined}
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="timezone-select"
                    className="text-xs font-semibold text-foreground"
                  >
                    Timezone
                  </label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger
                      id="timezone-select"
                      aria-label="Select Timezone"
                      className="w-full"
                    >
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PST">Pacific Time (PST - UTC-8)</SelectItem>
                      <SelectItem value="EST">Eastern Time (EST - UTC-5)</SelectItem>
                      <SelectItem value="GMT">Greenwich Mean Time (GMT - UTC+0)</SelectItem>
                      <SelectItem value="IST">India Standard Time (IST - UTC+5:30)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Security & Authentication */}
          <Card className="shadow-xs border-border">
            <CardHeader className="border-b border-border/60 pb-4">
              <div className="flex items-center gap-2">
                <Shield className="size-4 text-primary" />
                <CardTitle as="h2" className="text-base font-bold">
                  Security & Authentication
                </CardTitle>
              </div>
              <CardDescription className="text-xs">
                Manage Two-Factor Authentication (2FA) and security code verification.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* 2FA Switch Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
                <div>
                  <p className="text-sm font-semibold">Two-Factor Authentication (2FA)</p>
                  <p className="text-xs text-muted-foreground">
                    Require a security verification code when signing into your account.
                  </p>
                </div>
                <Switch
                  checked={twoFactorEnabled}
                  onCheckedChange={(val) => {
                    setTwoFactorEnabled(val);
                    setIsVerificationSent(false);
                    setOtpCode('');
                    setIsSaved(false);
                    toast.info(`Two-Factor Authentication ${val ? 'enabled' : 'disabled'}.`);
                  }}
                  aria-label="Toggle 2FA"
                />
              </div>

              {twoFactorEnabled && (
                <div className="p-5 rounded-xl border border-border/80 bg-muted/20 space-y-6">
                  {/* Step 1: Select 2FA Method */}
                  <div className="space-y-2">
                    <label htmlFor="2fa-method" className="text-xs font-semibold text-foreground">
                      Preferred 2FA Method
                    </label>
                    <Select
                      value={twoFactorMethod}
                      onValueChange={(val) => {
                        setTwoFactorMethod(val as 'authenticator' | 'sms' | 'hardware');
                        setIsVerificationSent(false);
                        setOtpCode('');
                      }}
                    >
                      <SelectTrigger
                        id="2fa-method"
                        aria-label="Select 2FA Method"
                        className="w-full sm:w-80"
                      >
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="authenticator">Authenticator App (TOTP)</SelectItem>
                        <SelectItem value="sms">SMS Text Verification</SelectItem>
                        <SelectItem value="hardware">Hardware Security Key</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Step 2: Method Specific Verification Action */}
                  {twoFactorMethod === 'sms' && (
                    <div className="space-y-3 p-4 rounded-lg border border-border bg-card">
                      <label htmlFor="phone-num" className="text-xs font-semibold text-foreground">
                        Phone Number for SMS Verification
                      </label>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Input
                          id="phone-num"
                          placeholder="+1 (555) 000-0000"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          size="sm"
                          className="shrink-0 font-semibold"
                          onClick={handleSendVerificationCode}
                        >
                          <Smartphone className="size-3.5 mr-1.5" />
                          Send Code
                        </Button>
                      </div>
                    </div>
                  )}

                  {twoFactorMethod === 'authenticator' && !isVerificationSent && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border border-border bg-card">
                      <div className="space-y-0.5">
                        <p className="text-xs font-semibold text-foreground">
                          Authenticator App Setup
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Scan QR code using Google Authenticator, 1Password, or Authy.
                        </p>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="shrink-0 font-semibold"
                        onClick={handleSendVerificationCode}
                      >
                        <QrCode className="size-3.5 mr-1.5 text-primary" />
                        Generate QR Code
                      </Button>
                    </div>
                  )}

                  {twoFactorMethod === 'hardware' && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border border-border bg-card">
                      <div className="space-y-0.5">
                        <p className="text-xs font-semibold text-foreground">
                          Hardware Security Key
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Use YubiKey or WebAuthn hardware key for authentication.
                        </p>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="shrink-0 font-semibold"
                        onClick={handleSendVerificationCode}
                      >
                        <Key className="size-3.5 mr-1.5 text-primary" />
                        Register Key
                      </Button>
                    </div>
                  )}

                  {/* Step 3: Progressive OTP 6-Digit Code Verification */}
                  {isVerificationSent && (
                    <div className="space-y-3 p-4 rounded-lg border border-primary/30 bg-primary/5">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-foreground">
                          Enter 6-Digit Verification PIN
                        </p>
                        <span className="text-[11px] text-muted-foreground">Expires in 10:00</span>
                      </div>
                      <OtpInput
                        length={6}
                        value={otpCode}
                        onValueChange={(val) => {
                          setOtpCode(val);
                          setIsSaved(false);
                        }}
                        onComplete={(val) => {
                          toast.success(`Security PIN verified: ${val}`);
                        }}
                        helperText="Enter 6-digit code to complete security verification"
                      />
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Section 3: Preferences & Agreements */}
          <Card className="shadow-xs border-border">
            <CardHeader className="border-b border-border/60 pb-4">
              <div className="flex items-center gap-2">
                <Bell className="size-4 text-primary" />
                <CardTitle as="h2" className="text-base font-bold">
                  Preferences & Notifications
                </CardTitle>
              </div>
              <CardDescription className="text-xs">
                Choose how and when you receive workspace notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
                <div>
                  <p className="text-sm font-semibold">Email Order & Security Alerts</p>
                  <p className="text-xs text-muted-foreground">
                    Receive instant email notifications on order fulfillment and security events.
                  </p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={(val) => {
                    setEmailNotifications(val);
                    setIsSaved(false);
                  }}
                  aria-label="Toggle Email Alerts"
                />
              </div>

              <div className="space-y-3 pt-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Email Digests
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <Checkbox
                      id="newsletter"
                      checked={weeklyNewsletter}
                      onCheckedChange={(checked) => {
                        setWeeklyNewsletter(!!checked);
                        setIsSaved(false);
                      }}
                    />
                    <label
                      htmlFor="newsletter"
                      className="text-xs font-medium text-foreground cursor-pointer"
                    >
                      Subscribe to weekly product updates and design system release notes
                    </label>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Checkbox
                      id="security-digest"
                      checked={securityDigest}
                      onCheckedChange={(checked) => {
                        setSecurityDigest(!!checked);
                        setIsSaved(false);
                      }}
                    />
                    <label
                      htmlFor="security-digest"
                      className="text-xs font-medium text-foreground cursor-pointer"
                    >
                      Receive monthly account security and audit log digests
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>

            {/* Form Footer Action Buttons */}
            <CardFooter className="border-t border-border pt-4 flex items-center justify-end gap-3">
              <Button variant="outline" type="button" onClick={handleReset}>
                Cancel
              </Button>
              <Button type="submit" className="font-semibold shadow-xs">
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
}

const meta = {
  title: 'Pages/Account Settings',
  component: AccountSettingsPage,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A complete User Account Settings page demonstrating the assembly of Breadcrumb, Card, Avatar, FileUpload, Input, Select, Switch, Checkbox, OtpInput, Alert, and Button components with step-by-step progressive disclosure flows.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AccountSettingsPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <AccountSettingsPage />,
};

export const SavedState: Story = {
  render: () => <AccountSettingsPage initialSavedState />,
};

export const ValidationErrorState: Story = {
  render: () => <AccountSettingsPage initialValidationErrors />,
};
