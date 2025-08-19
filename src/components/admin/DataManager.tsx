import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload, 
  Trash2, 
  Database, 
  CheckCircle, 
  XCircle, 
  Loader2,
  FileText,
  Users,
  Award,
  GraduationCap,
  Settings,
  BarChart3
} from "lucide-react";
import { DatabaseUploader, uploadAllPortfolioData, type UploadProgress, type UploadResult } from "@/utils/database-uploader";
import seedData from "@/data/database-seed.json";

export function DataManager() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [uploadResults, setUploadResults] = useState<UploadResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const dataStats = {
    projects: seedData.projects.length,
    experiences: seedData.experiences.length,
    skills: seedData.skills.length,
    testimonials: seedData.testimonials.length,
    certifications: seedData.certifications.length,
    education: seedData.education.length,
    services: seedData.services.length
  };

  const totalItems = Object.values(dataStats).reduce((sum, count) => sum + count, 0);

  const handleUploadAll = async (clearFirst = false) => {
    setIsUploading(true);
    setError(null);
    setUploadResults([]);
    setUploadProgress([]);

    try {
      const uploader = new DatabaseUploader(setUploadProgress);
      const results = await uploader.uploadAllData(clearFirst);
      setUploadResults(results);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadCollection = async (collectionName: string, data: any[], clearFirst = false) => {
    setIsUploading(true);
    setError(null);
    setUploadResults([]);

    try {
      const uploader = new DatabaseUploader(setUploadProgress);
      const result = await uploader.uploadCollection(collectionName, data, clearFirst);
      setUploadResults([result]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Portfolio Data Management
          </CardTitle>
          <CardDescription>
            Upload and manage all your portfolio data including projects, experience, skills, and more.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Data Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{dataStats.projects}</div>
              <div className="text-sm text-muted-foreground">Projects</div>
            </div>
            <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{dataStats.experiences}</div>
              <div className="text-sm text-muted-foreground">Experience</div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-950/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{dataStats.skills}</div>
              <div className="text-sm text-muted-foreground">Skills</div>
            </div>
            <div className="bg-orange-50 dark:bg-orange-950/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{totalItems}</div>
              <div className="text-sm text-muted-foreground">Total Items</div>
            </div>
          </div>

          {/* Upload Progress */}
          {uploadProgress.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium">Upload Progress:</h4>
              {uploadProgress.map((progress, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize">{progress.collection}</span>
                    <span>{progress.current}/{progress.total}</span>
                  </div>
                  <Progress 
                    value={(progress.current / progress.total) * 100} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Upload Actions */}
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all">Upload All Data</TabsTrigger>
              <TabsTrigger value="individual">Individual Collections</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => handleUploadAll(false)}
                  disabled={isUploading}
                  className="flex-1"
                >
                  {isUploading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4 mr-2" />
                  )}
                  Upload All Data
                </Button>
                
                <Button
                  onClick={() => handleUploadAll(true)}
                  disabled={isUploading}
                  variant="outline"
                  className="flex-1"
                >
                  {isUploading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4 mr-2" />
                  )}
                  Clear & Upload All
                </Button>
              </div>

              <div className="text-sm text-muted-foreground space-y-1">
                <p><strong>Upload All Data:</strong> Add all portfolio data to existing database</p>
                <p><strong>Clear & Upload All:</strong> Remove all existing data and upload fresh complete dataset</p>
                <p><strong>Includes:</strong> Projects, Experience, Skills, Testimonials, Certifications, Education, Services</p>
              </div>
            </TabsContent>

            <TabsContent value="individual" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={() => handleUploadCollection('projects', seedData.projects)}
                  disabled={isUploading}
                  variant="outline"
                  className="justify-start h-auto p-4"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-500" />
                    <div className="text-left">
                      <div className="font-medium">Projects</div>
                      <div className="text-xs text-muted-foreground">{dataStats.projects} items</div>
                    </div>
                  </div>
                </Button>

                <Button
                  onClick={() => handleUploadCollection('experiences', seedData.experiences)}
                  disabled={isUploading}
                  variant="outline"
                  className="justify-start h-auto p-4"
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-green-500" />
                    <div className="text-left">
                      <div className="font-medium">Experience</div>
                      <div className="text-xs text-muted-foreground">{dataStats.experiences} items</div>
                    </div>
                  </div>
                </Button>

                <Button
                  onClick={() => handleUploadCollection('skills', seedData.skills)}
                  disabled={isUploading}
                  variant="outline"
                  className="justify-start h-auto p-4"
                >
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-5 h-5 text-purple-500" />
                    <div className="text-left">
                      <div className="font-medium">Skills</div>
                      <div className="text-xs text-muted-foreground">{dataStats.skills} items</div>
                    </div>
                  </div>
                </Button>

                <Button
                  onClick={() => handleUploadCollection('certifications', seedData.certifications)}
                  disabled={isUploading}
                  variant="outline"
                  className="justify-start h-auto p-4"
                >
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-orange-500" />
                    <div className="text-left">
                      <div className="font-medium">Certifications</div>
                      <div className="text-xs text-muted-foreground">{dataStats.certifications} items</div>
                    </div>
                  </div>
                </Button>

                <Button
                  onClick={() => handleUploadCollection('education', seedData.education)}
                  disabled={isUploading}
                  variant="outline"
                  className="justify-start h-auto p-4"
                >
                  <div className="flex items-center gap-3">
                    <GraduationCap className="w-5 h-5 text-pink-500" />
                    <div className="text-left">
                      <div className="font-medium">Education</div>
                      <div className="text-xs text-muted-foreground">{dataStats.education} items</div>
                    </div>
                  </div>
                </Button>

                <Button
                  onClick={() => handleUploadCollection('testimonials', seedData.testimonials)}
                  disabled={isUploading}
                  variant="outline"
                  className="justify-start h-auto p-4"
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-cyan-500" />
                    <div className="text-left">
                      <div className="font-medium">Testimonials</div>
                      <div className="text-xs text-muted-foreground">{dataStats.testimonials} items</div>
                    </div>
                  </div>
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {/* Results Display */}
          {uploadResults.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium">Upload Results:</h4>
              {uploadResults.map((result, index) => (
                <Alert key={index} className={result.errors > 0 ? "border-yellow-500" : "border-green-500"}>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <div className="font-medium capitalize">{result.collection} Upload Complete</div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-green-600">
                          ✅ Success: {result.success}
                        </div>
                        <div className="text-red-600">
                          ❌ Errors: {result.errors}
                        </div>
                        <div className="text-blue-600">
                          📁 Total: {result.total}
                        </div>
                      </div>
                      {result.details.length > 0 && (
                        <details className="mt-2">
                          <summary className="cursor-pointer text-sm font-medium">View Details</summary>
                          <div className="mt-2 text-xs space-y-1 max-h-32 overflow-y-auto">
                            {result.details.map((detail, i) => (
                              <div key={i} className="font-mono">{detail}</div>
                            ))}
                          </div>
                        </details>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
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

          {/* Data Preview */}
          <div className="space-y-4">
            <h4 className="font-medium">Data Preview:</h4>
            <Tabs defaultValue="projects" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="other">Other</TabsTrigger>
              </TabsList>

              <TabsContent value="projects" className="space-y-3">
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {seedData.projects.map((project, index) => (
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
              </TabsContent>

              <TabsContent value="experience" className="space-y-3">
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {seedData.experiences.map((exp, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="text-lg">{exp.icon}</div>
                        <div>
                          <div className="font-medium text-sm">{exp.title}</div>
                          <div className="text-xs text-muted-foreground">{exp.company}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {exp.current && (
                          <span className="text-xs bg-green-500/10 text-green-600 px-2 py-1 rounded">
                            Current
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {exp.technologies?.length || 0} techs
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="skills" className="space-y-3">
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {seedData.skills.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="text-lg">{skill.icon}</div>
                        <div>
                          <div className="font-medium text-sm">{skill.name}</div>
                          <div className="text-xs text-muted-foreground">{skill.category}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          {skill.level}%
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {skill.yearsOfExperience}y
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="other" className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-muted/30 rounded-lg p-4 text-center">
                    <div className="text-lg mb-2">🏆</div>
                    <div className="font-medium">{dataStats.certifications}</div>
                    <div className="text-xs text-muted-foreground">Certifications</div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4 text-center">
                    <div className="text-lg mb-2">🎓</div>
                    <div className="font-medium">{dataStats.education}</div>
                    <div className="text-xs text-muted-foreground">Education</div>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4 text-center">
                    <div className="text-lg mb-2">💬</div>
                    <div className="font-medium">{dataStats.testimonials}</div>
                    <div className="text-xs text-muted-foreground">Testimonials</div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Instructions */}
          <div className="bg-muted/20 rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-sm">Instructions:</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• <strong>Upload All Data:</strong> Adds complete portfolio dataset to Firebase</li>
              <li>• <strong>Clear & Upload All:</strong> Removes existing data and uploads fresh dataset</li>
              <li>• <strong>Individual Collections:</strong> Upload specific data types only</li>
              <li>• <strong>Data includes:</strong> Projects with logos, experience, skills, certifications, education</li>
              <li>• <strong>All data is editable:</strong> Use other admin tabs to modify after upload</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Console Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Alternative Upload Methods
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="bg-muted/20 rounded-lg p-4">
              <h4 className="font-medium text-sm mb-2">Browser Console Method:</h4>
              <div className="font-mono text-xs bg-black/10 dark:bg-white/10 p-2 rounded">
                <div>// Upload all data</div>
                <div className="text-blue-600">uploadAllPortfolioData()</div>
                <div className="mt-2">// Clear and upload all</div>
                <div className="text-blue-600">clearAndUploadAll()</div>
                <div className="mt-2">// Upload projects only</div>
                <div className="text-blue-600">uploadProjectsOnly()</div>
              </div>
            </div>

            <div className="bg-muted/20 rounded-lg p-4">
              <h4 className="font-medium text-sm mb-2">Auto-Seeding:</h4>
              <p className="text-xs text-muted-foreground">
                Projects automatically upload when you visit the portfolio and no projects exist in the database.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}