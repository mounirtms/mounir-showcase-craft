import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, Trash2, Database, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { uploadProjectsToFirestore, clearExistingProjects } from "@/utils/upload-projects";
import { initialProjects } from "@/data/initial-projects";

interface UploadResult {
  success: number;
  errors: number;
  total: number;
}

export function ProjectUploader() {
  const [isUploading, setIsUploading] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUploadProjects = async (clearFirst = false) => {
    setIsUploading(true);
    setError(null);
    setUploadResult(null);

    try {
      const result = await uploadProjectsToFirestore(clearFirst);
      setUploadResult(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClearProjects = async () => {
    setIsClearing(true);
    setError(null);

    try {
      const clearedCount = await clearExistingProjects();
      setUploadResult({ success: 0, errors: 0, total: clearedCount });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Project Data Management
          </CardTitle>
          <CardDescription>
            Upload your portfolio projects to Firebase Firestore or manage existing data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Project Count Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-primary">{initialProjects.length}</div>
              <div className="text-sm text-muted-foreground">Projects Ready</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {initialProjects.filter(p => p.featured).length}
              </div>
              <div className="text-sm text-muted-foreground">Featured Projects</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {initialProjects.filter(p => p.logo).length}
              </div>
              <div className="text-sm text-muted-foreground">With Logos</div>
            </div>
          </div>

          {/* Upload Actions */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => handleUploadProjects(false)}
                disabled={isUploading || isClearing}
                className="flex-1"
              >
                {isUploading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4 mr-2" />
                )}
                Upload Projects
              </Button>
              
              <Button
                onClick={() => handleUploadProjects(true)}
                disabled={isUploading || isClearing}
                variant="outline"
                className="flex-1"
              >
                {isUploading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4 mr-2" />
                )}
                Clear & Upload
              </Button>
              
              <Button
                onClick={handleClearProjects}
                disabled={isUploading || isClearing}
                variant="destructive"
              >
                {isClearing ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4 mr-2" />
                )}
                Clear All
              </Button>
            </div>

            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>Upload Projects:</strong> Add projects to existing data</p>
              <p><strong>Clear & Upload:</strong> Remove all existing projects and upload fresh data</p>
              <p><strong>Clear All:</strong> Remove all projects from database</p>
            </div>
          </div>

          {/* Results */}
          {uploadResult && (
            <Alert className={uploadResult.errors > 0 ? "border-yellow-500" : "border-green-500"}>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <div className="font-medium">Upload Complete!</div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-green-600">
                      ✅ Success: {uploadResult.success}
                    </div>
                    <div className="text-red-600">
                      ❌ Errors: {uploadResult.errors}
                    </div>
                    <div className="text-blue-600">
                      📁 Total: {uploadResult.total}
                    </div>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="font-medium">Upload Failed</div>
                <div className="text-sm mt-1">{error}</div>
              </AlertDescription>
            </Alert>
          )}

          {/* Project Preview */}
          <div className="space-y-3">
            <h4 className="font-medium">Projects to Upload:</h4>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {initialProjects.map((project, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    {project.logo && (
                      <img src={project.logo} alt="" className="w-6 h-6 object-contain" />
                    )}
                    <div>
                      <div className="font-medium text-sm">{project.title}</div>
                      <div className="text-xs text-muted-foreground">{project.category}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {project.featured && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        Featured
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {project.technologies?.length || 0} techs
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}