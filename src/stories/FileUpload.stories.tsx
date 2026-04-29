import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { FileUpload } from '@/components/file-upload';

const meta = {
  title: 'Components/FileUpload',
  component: FileUpload,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'An accessible drag-and-drop file picker with validation, previews, removals, and externally controlled upload progress.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[min(100vw-2rem,32rem)]">
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof FileUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <FileUpload description="Select a document up to 10 MB." maxSize={10 * 1024 * 1024} />
  ),
};

export const Images: Story = {
  render: () => (
    <FileUpload
      label="Product images"
      multiple
      accept={{ 'image/*': [] }}
      description="PNG, JPEG, GIF, or WebP."
    />
  ),
};

export const WithProgress: Story = {
  render: function ProgressStory() {
    const [files, setFiles] = useState<File[]>([]);
    const progress = Object.fromEntries(
      files.map((file, index) => [`${file.name}-${file.size}-${file.lastModified}-${index}`, 64]),
    );
    return (
      <FileUpload
        label="Attachments"
        multiple
        value={files}
        onValueChange={setFiles}
        uploadProgress={progress}
      />
    );
  },
};

export const Invalid: Story = {
  render: () => (
    <FileUpload
      label="Invoice"
      accept={{ 'application/pdf': ['.pdf'] }}
      error="Upload a File to continue."
    />
  ),
};
