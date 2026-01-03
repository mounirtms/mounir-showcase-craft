import React from "react";
import type { Skill } from "@/hooks/useSkills";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Eye, EyeOff, Star, Pencil, Trash2 } from "lucide-react";

export type SkillCardProps = {
  skill: Skill;
  onEdit?: (skill: Skill) => void;
  onDelete?: (skill: Skill) => void;
  className?: string;
};

export const SkillCard: React.FC<SkillCardProps> = ({ skill, onEdit, onDelete, className }) => {
  const levelColor = (() => {
    const level = skill.level;
    if (level >= 90) return "bg-purple-500";
    if (level >= 75) return "bg-green-500";
    if (level >= 50) return "bg-yellow-500";
    if (level < 30) return "bg-gray-500";
    return "bg-blue-500";
  })();

  return (
    <Card className={`border-0 shadow-medium hover:shadow-lg transition-shadow ${className || ""}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-md flex-shrink-0 overflow-hidden flex items-center justify-center text-white"
            style={{ backgroundColor: skill.color || "#6E56CF" }}
            aria-hidden
          >
            {skill.icon ? <span className="text-xl">{skill.icon}</span> : <span className="text-lg">🏷️</span>}
          </div>
          <div>
            <CardTitle className="text-base font-semibold leading-tight">{skill.name}</CardTitle>
            <div className="text-xs text-muted-foreground">{skill.yearsOfExperience} {skill.yearsOfExperience === 1 ? "year" : "years"} exp.</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {skill.featured && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" aria-label="Featured" />}
          {skill.disabled ? (
            <EyeOff className="h-4 w-4 text-muted-foreground" aria-label="Hidden" />
          ) : (
            <Eye className="h-4 w-4 text-green-500" aria-label="Visible" />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="capitalize">{skill.category}</Badge>
          <Badge variant="secondary">Priority {skill.priority}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Progress value={skill.level} className="h-2" indicatorClassName={levelColor} />
          <span className="text-sm">{skill.level}%</span>
        </div>
        {skill.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{skill.description}</p>
        )}
        {(onEdit || onDelete) && (
          <div className="pt-2 flex items-center justify-end gap-2">
            {onEdit && (
              <Button size="sm" variant="outline" onClick={() => onEdit(skill)}>
                <Pencil className="h-4 w-4 mr-1" /> Edit
              </Button>
            )}
            {onDelete && (
              <Button size="sm" variant="destructive" onClick={() => onDelete(skill)}>
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SkillCard;
