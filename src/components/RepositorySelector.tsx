"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info, Check, ChevronsUpDown } from "@/components/ui/icons";
import { useRepository } from "@/store/store";
import {
  useRepositoriesData,
  useBranchesData,
} from "@/hooks/useRepositoryData";

export default function RepositorySelector() {
  const {
    selectedRepository,
    selectedBranch,
    username,
    selectRepository,
    selectBranch,
  } = useRepository();

  const { repositories, isLoading: repoLoading } =
    useRepositoriesData(username);
  const { branches, isLoading: branchLoading } = useBranchesData(
    username,
    selectedRepository?.name || ""
  );

  const [repoOpen, setRepoOpen] = useState(false);
  const [branchOpen, setBranchOpen] = useState(false);

  // Auto-select first branch when branches are loaded
  useEffect(() => {
    if (branches.length > 0 && !selectedBranch && selectedRepository) {
      selectBranch(branches[0]);
    }
  }, [branches, selectedBranch, selectedRepository, selectBranch]);

  const handleRepositoryChange = (repositoryName: string) => {
    const repository = repositories.find(
      (repo) => repo.name === repositoryName
    );
    if (repository) {
      selectRepository(repository);
    }
    setRepoOpen(false);
  };

  const handleBranchChange = (branchName: string) => {
    const branch = branches.find((b) => b.name === branchName);
    if (branch) {
      selectBranch(branch);
    }
    setBranchOpen(false);
  };

  return (
    <div className="space-y-3">
      {/* Repository Dropdown */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">
            Repository
          </label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center cursor-help">
                  <Info className="w-4 h-4 text-muted-foreground" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Only public repos are visible</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <Popover open={repoOpen} onOpenChange={setRepoOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={repoOpen}
              className="w-full justify-between"
              disabled={repoLoading}
            >
              {selectedRepository?.name ||
                (repoLoading ? "Loading repositories..." : "Select repository")}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search repositories..." />
              <CommandList>
                <CommandEmpty>No repository found.</CommandEmpty>
                <CommandGroup>
                  {repositories.map((repo) => (
                    <CommandItem
                      key={repo.id}
                      value={repo.name}
                      onSelect={handleRepositoryChange}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedRepository?.name === repo.name
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {repo.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Branch Dropdown */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-foreground">Branch</label>
        <Popover open={branchOpen} onOpenChange={setBranchOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={branchOpen}
              className="w-full justify-between"
              disabled={branchLoading || !selectedRepository}
            >
              {selectedBranch?.name ||
                (branchLoading
                  ? "Loading branches..."
                  : !selectedRepository
                    ? "Select repository first"
                    : "Select branch")}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search branches..." />
              <CommandList>
                <CommandEmpty>No branch found.</CommandEmpty>
                <CommandGroup>
                  {branches.map((branch) => (
                    <CommandItem
                      key={branch.name}
                      value={branch.name}
                      onSelect={handleBranchChange}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedBranch?.name === branch.name
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {branch.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
