import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { FileUpload } from './file-upload';

function file(name: string, type = 'text/plain', content = 'content') {
  return new File([content], name, { type, lastModified: 1 });
}

describe('FileUpload', () => {
  it('uploads files from the file picker and removes them', async () => {
    const user = userEvent.setup();
    render(<FileUpload label="Attachments" multiple />);

    await user.upload(screen.getByLabelText('Attachments'), [file('notes.txt'), file('todo.txt')]);

    expect(screen.getByRole('list', { name: 'Selected files' })).toHaveTextContent('notes.txt');
    expect(screen.getByRole('list', { name: 'Selected files' })).toHaveTextContent('todo.txt');
    await user.click(screen.getByRole('button', { name: 'Remove notes.txt' }));
    expect(screen.queryByText('notes.txt')).not.toBeInTheDocument();
    expect(screen.getByText('todo.txt')).toBeInTheDocument();
  });

  it('supports controlled files and reports changes', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <FileUpload
        label="Attachments"
        value={[file('existing.pdf', 'application/pdf')]}
        onValueChange={onValueChange}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Remove existing.pdf' }));
    expect(onValueChange).toHaveBeenCalledWith([]);
    expect(screen.getByText('existing.pdf')).toBeInTheDocument();
  });

  it('applies accepted types and exposes validation feedback', async () => {
    const user = userEvent.setup();
    const onFilesRejected = vi.fn();
    render(
      <FileUpload
        label="Image"
        validator={() => ({ code: 'invalid-file', message: 'Invalid file' })}
        onFilesRejected={onFilesRejected}
      />,
    );

    await user.upload(screen.getByLabelText('Image'), file('notes.txt'));
    expect(onFilesRejected).toHaveBeenCalled();
    expect(screen.queryByText('notes.txt')).not.toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid file');
  });

  it('renders image previews and upload progress accessibly', async () => {
    const user = userEvent.setup();
    const image = file('photo.png', 'image/png');
    const { container } = render(
      <FileUpload label="Photos" uploadProgress={{ 'photo.png-7-1-0': 42 }} />,
    );

    await user.upload(screen.getByLabelText('Photos'), image);
    expect(container.querySelector('img')).toHaveAttribute('src', expect.stringMatching(/^blob:/));
    expect(screen.getByRole('progressbar', { name: 'photo.png upload progress' })).toHaveAttribute(
      'aria-valuenow',
      '42',
    );
  });

  it('announces errors to assistive technology and disables interaction', () => {
    render(<FileUpload label="Resume" error="A PDF is required." disabled />);
    expect(screen.getByRole('alert')).toHaveTextContent('A PDF is required.');
    expect(screen.getByLabelText('Resume')).toBeDisabled();
  });
});
