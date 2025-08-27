import React from "react";
import type { Skill } from "@/hooks/useSkills";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Trash2, Eye, EyeOff, Star, RefreshCw } from "lucide-react";

export type SkillBulkActionsProps = {
  selected: Skill[];
  onDeleteSelected?: (skills: Skill[]) => void;
  onExportSelected?: (skills: Skill[]) => void;
  onToggleVisibilitySelected?: (skills: Skill[], hidden: boolean) => void;
  onToggleFeaturedSelected?: (skills: Skill[], featured: boolean) => void;
  className?: string;
};

export const SkillBulkActions: React.FC<SkillBulkActionsProps> = ({
  selected,
  onDeleteSelected,
  onExportSelected,
  onToggleVisibilitySelected,
  onToggleFeaturedSelected,
  className,
}) => {
  const disabled = selected.length === 0;

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className || ""}`}>
      <Badge variant="secondary" className="mr-2">{selected.length} selected</Badge>

      <Button
        size="sm"
        variant="outline"
        disabled={disabled}
        onClick={() => onExportSelected?.(selected)}
      >
        <Download className="h-4 w-4 mr-2" /> Export
      </Button>

      <div aria-hidden className="h-6 w-px bg-border mx-1" />

      <Button
        size="sm"
        variant="outline"
        disabled={disabled}
        onClick={() => onToggleVisibilitySelected?.(selected, true)}
      >
        <EyeOff className="h-4 w-4 mr-2" /> Hide
      </Button>
      <Button
        size="sm"
        variant="outline"
        disabled={disabled}
        onClick={() => onToggleVisibilitySelected?.(selected, false)}
      >
        <Eye className="h-4 w-4 mr-2" /> Show
      </Button>

      <div aria-hidden className="h-6 w-px bg-border mx-1" />

      <Button
        size="sm"
        variant="outline"
        disabled={disabled}
        onClick={() => onToggleFeaturedSelected?.(selected, true)}
      >
        <Star className="h-4 w-4 mr-2" /> Mark Featured
      </Button>
      <Button
        size="sm"
        variant="outline"
        disabled={disabled}
        onClick={() => onToggleFeaturedSelected?.(selected, false)}
      >
        <RefreshCw className="h-4 w-4 mr-2" /> Unmark Featured
      </Button>

      <div aria-hidden className="h-6 w-px bg-border mx-1" />

      <Button
        size="sm"
        variant="destructive"
        disabled={disabled}
        onClick={() => onDeleteSelected?.(selected)}
      >
        <Trash2 className="h-4 w-4 mr-2" /> Delete
      </Button>
    </div>
  );
};

export default SkillBulkActions;
