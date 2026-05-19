import { PageHeader } from "@/components/ui";
import { UploadDropzone } from "@/components/UploadDropzone";

export default function UploadPage() {
  return <><PageHeader title="Upload Calls" subtitle="Store recorded calls locally, then transcribe, audit, score, and queue them for review." /><UploadDropzone /></>;
}
