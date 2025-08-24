import { useState } from 'react';
import { 
  useApplications, 
  type Application, 
  type ApplicationInput, 
  type ApplicationStatus,
  type ApplicationPriority,
  DEFAULT_APPLICATION 
} from '@/hooks/useApplications';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Building2,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  Globe,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Target
} from 'lucide-react';

const statusColors = {
  'applied': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  'screening': 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  'interview': 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  'technical-test': 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  'final-interview': 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
  'offer': 'bg-green-500/10 text-green-600 border-green-500/20',
  'rejected': 'bg-red-500/10 text-red-600 border-red-500/20',
  'withdrawn': 'bg-gray-500/10 text-gray-600 border-gray-500/20',
  'accepted': 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
};

const priorityColors = {
  'low': 'bg-gray-500/10 text-gray-600 border-gray-500/20',
  'medium': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  'high': 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  'urgent': 'bg-red-500/10 text-red-600 border-red-500/20'
};

export function ApplicationsManager() {
  const { 
    applications, 
    loading, 
    addApplication, 
    updateApplication, 
    deleteApplication,
    getApplicationsByStatus,
    getUpcomingInterviews,
    getStats
  } = useApplications();
  
  const [editingApplication, setEditingApplication] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<ApplicationInput | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const stats = getStats();
  const upcomingInterviews = getUpcomingInterviews();

  const handleAdd = async (data: ApplicationInput) => {
    await addApplication(data);
    setEditingData(null);
    setActiveTab('list');
  };

  const handleUpdate = async (id: string, data: Partial<ApplicationInput>) => {
    await updateApplication(id, data);
    setEditingApplication(null);
    setEditingData(null);
    setActiveTab('list');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this application?')) {
      await deleteApplication(id);
    }
  };

  const startEditing = (application: Application) => {
    setEditingApplication(application.id);
    setEditingData({ ...application });
    setActiveTab('add');
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-medium">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-medium">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-orange-500" />
              <div>
                <div className="text-2xl font-bold">{stats.pending}</div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-medium">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-purple-500" />
              <div>
                <div className="text-2xl font-bold">{stats.upcomingInterviews}</div>
                <div className="text-sm text-muted-foreground">Interviews</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-medium">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{stats.byStatus.offer || 0}</div>
                <div className="text-sm text-muted-foreground">Offers</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="list">Applications</TabsTrigger>
          <TabsTrigger value="add">
            {editingApplication ? 'Edit Application' : 'Add Application'}
          </TabsTrigger>
          <TabsTrigger value="interviews">Interviews</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-medium">
              <CardHeader>
                <CardTitle>Status Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(stats.byStatus).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${statusColors[status as ApplicationStatus]?.split(' ')[0] || 'bg-gray-500'}`} />
                        <span className="capitalize">{status.replace('-', ' ')}</span>
                      </div>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-medium">
              <CardHeader>
                <CardTitle>Upcoming Interviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingInterviews.slice(0, 5).map(({ application, interview }) => (
                    <div key={`${application.id}-${interview.id}`} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="font-medium">{application.companyName}</div>
                        <div className="text-sm text-muted-foreground">{application.position}</div>
                        <div className="text-xs text-muted-foreground">{interview.date}</div>
                      </div>
                      <Badge className={`${statusColors[application.status]} border-0`}>
                        {interview.type}
                      </Badge>
                    </div>
                  ))}
                  {upcomingInterviews.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                      No upcoming interviews
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="list">
          <Card className="border-0 shadow-medium">
            <CardHeader>
              <CardTitle>Applications List</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading applications...</div>
              ) : applications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No applications found. Add your first application to get started.
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((application) => (
                    <div key={application.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-lg">{application.companyName}</h3>
                            <Badge className={statusColors[application.status]}>
                              {application.status.replace('-', ' ')}
                            </Badge>
                            <Badge variant="outline" className={priorityColors[application.priority]}>
                              {application.priority}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground">{application.position}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(application.applicationDate).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {application.companyLocation}
                            </div>
                            <div className="flex items-center gap-1">
                              <Building2 className="h-4 w-4" />
                              {application.workType}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {application.companyWebsite && (
                            <Button size="sm" variant="outline" asChild>
                              <a href={application.companyWebsite} target="_blank" rel="noopener noreferrer">
                                <Globe className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                          <Button size="sm" variant="outline" onClick={() => startEditing(application)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(application.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add">
          <ApplicationForm
            application={editingData}
            isEditing={!!editingApplication}
            onSubmit={(data) => {
              if (editingApplication) {
                handleUpdate(editingApplication, data);
              } else {
                handleAdd(data);
              }
            }}
            onCancel={() => {
              setEditingApplication(null);
              setEditingData(null);
              setActiveTab('list');
            }}
          />
        </TabsContent>

        <TabsContent value="interviews">
          <Card className="border-0 shadow-medium">
            <CardHeader>
              <CardTitle>Interview Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingInterviews.map(({ application, interview }) => (
                  <div key={`${application.id}-${interview.id}`} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{application.companyName} - {application.position}</h3>
                        <p className="text-muted-foreground">Interview Type: {interview.type}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {interview.date} {interview.time && `at ${interview.time}`}
                          </div>
                          {interview.interviewer && (
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {interview.interviewer}
                            </div>
                          )}
                        </div>
                      </div>
                      <Badge className={statusColors[interview.status as any] || 'bg-gray-500/10'}>
                        {interview.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                {upcomingInterviews.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No interviews scheduled
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ApplicationForm({ 
  application, 
  isEditing, 
  onSubmit, 
  onCancel 
}: {
  application: ApplicationInput | null;
  isEditing: boolean;
  onSubmit: (data: ApplicationInput) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<ApplicationInput>(
    application || DEFAULT_APPLICATION
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateField = (field: keyof ApplicationInput, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="border-0 shadow-medium">
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Application' : 'Add New Application'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Company Name *</Label>
                <Input
                  value={formData.companyName}
                  onChange={(e) => updateField('companyName', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Position *</Label>
                <Input
                  value={formData.position}
                  onChange={(e) => updateField('position', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Location *</Label>
                <Input
                  value={formData.companyLocation}
                  onChange={(e) => updateField('companyLocation', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Application Date *</Label>
                <Input
                  type="date"
                  value={formData.applicationDate}
                  onChange={(e) => updateField('applicationDate', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Status & Priority */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Status & Priority</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => updateField('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="applied">Applied</SelectItem>
                    <SelectItem value="screening">Screening</SelectItem>
                    <SelectItem value="interview">Interview</SelectItem>
                    <SelectItem value="technical-test">Technical Test</SelectItem>
                    <SelectItem value="final-interview">Final Interview</SelectItem>
                    <SelectItem value="offer">Offer</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="withdrawn">Withdrawn</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => updateField('priority', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Work Type</Label>
                <Select
                  value={formData.workType}
                  onValueChange={(value) => updateField('workType', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="onsite">On-site</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Job Details</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Job Description</Label>
                <Textarea
                  value={formData.jobDescription}
                  onChange={(e) => updateField('jobDescription', e.target.value)}
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label>Requirements (one per line)</Label>
                <Textarea
                  value={formData.requirements.join('\n')}
                  onChange={(e) => updateField('requirements', e.target.value.split('\n').filter(r => r.trim()))}
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Notes</h3>
            <Textarea
              value={formData.notes}
              onChange={(e) => updateField('notes', e.target.value)}
              rows={4}
              placeholder="Add any additional notes about this application..."
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" className="flex-1">
              {isEditing ? 'Update Application' : 'Add Application'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
