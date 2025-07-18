"use client"

import { useState } from "react"
import { X, Loader2, AlertCircle } from "lucide-react"
import { addProject } from "@/actions/project-actions"
import type { Project } from "@/types/project"
import { AxiosError } from "axios"

interface AddProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onProjectAdded: (project: Project) => void
}

export function AddProjectModal({ isOpen, onClose, onProjectAdded }: AddProjectModalProps) {
  const [projectName, setProjectName] = useState("")
  const [githubUrl, setGithubUrl] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleAddProject = async () => {
    if (!githubUrl || !projectName) return

    setIsAdding(true)
    try {
      const { project , error } = await addProject(githubUrl, projectName);

      if(error){
        throw error;
      }

      if(project){
        onProjectAdded(project);
        setProjectName("");
        setGithubUrl("");
        setError("");
      }
    } catch (err) {
      if(err instanceof AxiosError){
        setError(err.response?.data.message)
      }else if(err instanceof Error){
        setError(err.message);
      }
      else{
        setError("Failed to add project")
      }
    } finally {
      setIsAdding(false)
    }
  }
  const handleClose = () => {
    setError("");
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 className="text-xl font-semibold">Add New Project</h2>
          <button onClick={handleClose} className="text-muted-foreground hover:text-foreground rounded-full p-1">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label htmlFor="projectName" className="block text-sm font-medium mb-1">
              Project Name
            </label>
            <input
              id="projectName"
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="My Awesome Project"
              className="w-full border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-accent"
              disabled={isAdding}
            />
          </div>

          <div>
            <label htmlFor="githubUrl" className="block text-sm font-medium mb-1">
              GitHub Repository URL
            </label>
            <input
              id="githubUrl"
              type="text"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="username/repo"
              className="w-full border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-accent"
              disabled={isAdding}
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm flex items-center gap-1">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="border-t border-border p-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-border rounded-md hover:bg-secondary/50 transition-colors"
            disabled={isAdding}
          >
            Cancel
          </button>
          <button
            onClick={handleAddProject}
            disabled={!githubUrl || !projectName || isAdding}
            className="bg-accent text-accent-foreground px-4 py-2 rounded-md hover:bg-accent/90 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isAdding && <Loader2 className="h-4 w-4 animate-spin" />}
            Add Project
          </button>
        </div>
      </div>
    </div>
  )
}
