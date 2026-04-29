import { type Accept, type FileError, type FileRejection, useDropzone } from 'react-dropzone';
import { FileIcon, ImageIcon, LoaderCircle, UploadCloud, X } from 'lucide-react';
import {
  forwardRef,
  useEffect,
  useId,
  useMemo,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';

import { cn } from '@/lib/cn';

export type Validator = <T extends File>(file: T) => FileError | readonly FileError[] | null;

export interface FileUploadProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'defaultValue' | 'onChange'
> {
  /** Controlled selected files. */
  value?: File[];
  /** Initial selected files for uncontrolled use. */
  defaultValue?: File[];
  /** Called whenever files are added or removed. */
  onValueChange?: (files: File[]) => void;
  /** MIME types and extensions accepted by the native picker and drop zone. */
  accept?: Accept;
  multiple?: boolean;
  maxFiles?: number;
  minSize?: number;
  maxSize?: number;
  disabled?: boolean;
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  /** Enables image thumbnails for image files. */
  preview?: boolean;
  /** Upload progress from 0–100 keyed by `getFileId`. */
  uploadProgress?: Record<string, number | undefined>;
  /** Supplies a stable ID for upload progress and list keys. */
  getFileId?: (file: File, index: number) => string;
  validator?: Validator;
  onFilesRejected?: (rejections: FileRejection[]) => void;
}

function defaultFileId(file: File, index: number) {
  return `${file.name}-${file.size}-${file.lastModified}-${index}`;
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const units = ['KB', 'MB', 'GB'];
  const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)) - 1, units.length - 1);
  return `${(bytes / 1024 ** (unitIndex + 1)).toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function usePreviews(
  files: File[],
  enabled: boolean,
  getFileId: (file: File, index: number) => string,
) {
  const previews = useMemo(() => {
    if (!enabled) return new Map<string, string>();
    return new Map(
      files
        .map((file, index) => [getFileId(file, index), file] as const)
        .filter(([, file]) => file.type.startsWith('image/'))
        .map(([id, file]) => [id, URL.createObjectURL(file)]),
    );
  }, [enabled, files, getFileId]);

  useEffect(() => () => previews.forEach((url) => URL.revokeObjectURL(url)), [previews]);
  return previews;
}

const FileUpload = forwardRef<HTMLDivElement, FileUploadProps>(
  (
    {
      value,
      defaultValue = [],
      onValueChange,
      accept,
      multiple = false,
      maxFiles,
      minSize,
      maxSize,
      disabled = false,
      label = 'Upload files',
      description,
      error,
      preview = true,
      uploadProgress,
      getFileId = defaultFileId,
      validator,
      onFilesRejected,
      className,
      id: providedId,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const id = providedId ?? generatedId;
    const descriptionId = description || error ? `${id}-description` : undefined;
    const [uncontrolledFiles, setUncontrolledFiles] = useState<File[]>(defaultValue);
    const [rejections, setRejections] = useState<FileRejection[]>([]);
    const files = value ?? uncontrolledFiles;
    const previews = usePreviews(files, preview, getFileId);

    const updateFiles = (nextFiles: File[]) => {
      if (value === undefined) setUncontrolledFiles(nextFiles);
      onValueChange?.(nextFiles);
    };

    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
      accept,
      disabled,
      maxFiles,
      minSize,
      maxSize,
      multiple,
      validator,
      onDrop: (acceptedFiles, fileRejections) => {
        updateFiles(multiple ? [...files, ...acceptedFiles] : acceptedFiles.slice(0, 1));
        setRejections(fileRejections);
        if (fileRejections.length > 0) onFilesRejected?.(fileRejections);
      },
    });

    const removeFile = (fileIndex: number) => {
      updateFiles(files.filter((_, index) => index !== fileIndex));
    };

    const rootProps = getRootProps({
      'aria-describedby': descriptionId,
      'aria-invalid': error ? true : undefined,
    });

    return (
      <div
        ref={ref}
        data-slot="file-upload"
        className={cn('grid w-full gap-3', className)}
        {...props}
      >
        {label ? (
          <p id={`${id}-label`} className="text-sm font-medium text-foreground">
            {label}
          </p>
        ) : null}
        <div
          {...rootProps}
          className={cn(
            'flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/20 px-4 py-6 text-center transition-colors',
            'hover:border-primary/50 hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            isDragActive && !isDragReject && 'border-primary bg-primary/5',
            isDragReject && 'border-destructive bg-destructive/5',
            disabled && 'cursor-not-allowed opacity-50 hover:border-border hover:bg-muted/20',
          )}
        >
          <input {...getInputProps({ id, disabled, 'aria-labelledby': `${id}-label` })} />
          <UploadCloud className="mb-2 size-7 text-muted-foreground" aria-hidden="true" />
          <p className="text-sm font-medium text-foreground">
            {isDragReject
              ? 'This file cannot be uploaded'
              : isDragActive
                ? 'Drop files here'
                : 'Drag and drop files here'}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">or click to browse</p>
          {accept ? (
            <p className="mt-2 text-xs text-muted-foreground">Accepted file types apply</p>
          ) : null}
        </div>
        {description || error ? (
          <p
            id={descriptionId}
            role={error ? 'alert' : undefined}
            className={cn('text-sm text-muted-foreground', error && 'text-destructive')}
          >
            {error ?? description}
          </p>
        ) : null}
        {rejections.length > 0 ? (
          <ul role="alert" className="grid gap-1 text-sm text-destructive">
            {rejections.map(({ file, errors }) => (
              <li key={`${file.name}-${file.size}-${file.lastModified}`}>
                {file.name}: {errors.map((fileError) => fileError.message).join(', ')}
              </li>
            ))}
          </ul>
        ) : null}
        {files.length > 0 ? (
          <ul aria-label="Selected files" className="grid gap-2">
            {files.map((file, index) => {
              const fileId = getFileId(file, index);
              const progress = uploadProgress?.[fileId];
              const imagePreview = previews.get(fileId);
              return (
                <li
                  key={fileId}
                  className="flex min-w-0 items-center gap-3 rounded-md border border-border bg-background p-2.5"
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt=""
                      className="size-10 shrink-0 rounded object-cover"
                    />
                  ) : file.type.startsWith('image/') ? (
                    <ImageIcon
                      className="size-5 shrink-0 text-muted-foreground"
                      aria-hidden="true"
                    />
                  ) : (
                    <FileIcon
                      className="size-5 shrink-0 text-muted-foreground"
                      aria-hidden="true"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                    {progress !== undefined ? (
                      <div
                        className="mt-2 flex items-center gap-2"
                        role="progressbar"
                        aria-label={`${file.name} upload progress`}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={Math.round(Math.max(0, Math.min(progress, 100)))}
                      >
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary transition-[width]"
                            style={{ width: `${Math.max(0, Math.min(progress, 100))}%` }}
                          />
                        </div>
                        <span className="text-xs tabular-nums text-muted-foreground">
                          {Math.round(progress)}%
                        </span>
                      </div>
                    ) : null}
                  </div>
                  {progress !== undefined && progress < 100 ? (
                    <LoaderCircle
                      className="size-4 animate-spin text-muted-foreground"
                      aria-label="Uploading"
                    />
                  ) : null}
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    disabled={disabled}
                    aria-label={`Remove ${file.name}`}
                    className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  >
                    <X className="size-4" aria-hidden="true" />
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    );
  },
);

FileUpload.displayName = 'FileUpload';

export { FileUpload };
export type { Accept, FileRejection };
