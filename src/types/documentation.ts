// Documentation TypeScript Interfaces
// Based on contracts from specs/002-create-user-documentation/contracts/documentation-api.ts

export interface DocumentationAPI {
  // Navigation
  getDocumentationStructure(): DocumentationStructure;
  navigateToSection(sectionId: string, subsectionId?: string): void;
  
  // Content retrieval
  getSectionContent(sectionId: string): DocumentationSection;
  getSubsectionContent(sectionId: string, subsectionId: string): DocumentationSubsection;
  
  // Search (future enhancement)
  searchDocumentation?(query: string): SearchResult[];
  
  // User preferences
  getUserPreferences(): UserPreferences;
  updateUserPreferences(preferences: Partial<UserPreferences>): void;
}

export interface DocumentationStructure {
  sections: DocumentationSection[];
  lastUpdated: string;
  version: string;
}

export interface DocumentationSection {
  id: string;
  title: string;
  description: string;
  icon?: string;
  order: number;
  subsections: DocumentationSubsection[];
}

export interface DocumentationSubsection {
  id: string;
  title: string;
  content: DocumentationContent;
  order: number;
}

export interface DocumentationContent {
  overview: string;
  steps?: Step[];
  examples?: Example[];
  screenshots?: Screenshot[];
  relatedLinks?: RelatedLink[];
}

export interface Step {
  number: number;
  title: string;
  description: string;
  screenshot?: string;
  tip?: string;
}

export interface Example {
  title: string;
  description: string;
  code?: string;
  result: string;
}

export interface Screenshot {
  id: string;
  filename: string;
  altText: string;
  caption?: string;
  width?: number;
  height?: number;
}

export interface RelatedLink {
  title: string;
  sectionId: string;
  subsectionId?: string;
  description?: string;
}

export interface KeyboardShortcut {
  key: string;
  description: string;
  category: string;
  context?: string;
}

export interface TroubleshootingEntry {
  id: string;
  problem: string;
  symptoms: string[];
  solution: string;
  category: string;
  relatedFeatures: string[];
}

export interface SearchResult {
  sectionId: string;
  subsectionId?: string;
  title: string;
  snippet: string;
  relevance: number;
}

export interface UserPreferences {
  preferredTheme: 'light' | 'dark' | 'auto';
  fontSize: 'small' | 'medium' | 'large';
  lastVisitedSection?: string;
  sidebarCollapsed?: boolean;
}

export interface NavigationState {
  currentSectionId: string;
  currentSubsectionId?: string;
  breadcrumbs: BreadcrumbItem[];
  sidebarOpen: boolean;
}

export interface BreadcrumbItem {
  title: string;
  sectionId: string;
  subsectionId?: string;
}

// React Component Props Contracts

export interface DocumentationPageProps {
  initialSection?: string;
  initialSubsection?: string;
}

export interface DocumentationSidebarProps {
  structure: DocumentationStructure;
  currentSectionId: string;
  currentSubsectionId?: string;
  isOpen: boolean;
  onToggle: () => void;
  onNavigate: (sectionId: string, subsectionId?: string) => void;
}

export interface DocumentationContentProps {
  section: DocumentationSection;
  subsection?: DocumentationSubsection;
  onNavigate: (sectionId: string, subsectionId?: string) => void;
}

export interface DocumentationBreadcrumbsProps {
  breadcrumbs: BreadcrumbItem[];
  onNavigate: (sectionId: string, subsectionId?: string) => void;
}

export interface KeyboardShortcutsTableProps {
  shortcuts: KeyboardShortcut[];
  groupByCategory?: boolean;
}

export interface TroubleshootingListProps {
  entries: TroubleshootingEntry[];
  selectedCategory?: string;
  onCategoryFilter: (category: string | undefined) => void;
}

// Validation Schemas (for runtime validation)

export const DocumentationSectionSchema = {
  id: { required: true, type: 'string', pattern: /^[a-z0-9-]+$/ },
  title: { required: true, type: 'string', minLength: 1 },
  description: { required: true, type: 'string', minLength: 1 },
  icon: { required: false, type: 'string' },
  order: { required: true, type: 'number', min: 1 },
  subsections: { required: true, type: 'array' }
};

export const StepSchema = {
  number: { required: true, type: 'number', min: 1 },
  title: { required: true, type: 'string', minLength: 1 },
  description: { required: true, type: 'string', minLength: 1 },
  screenshot: { required: false, type: 'string' },
  tip: { required: false, type: 'string' }
};

export const ScreenshotSchema = {
  id: { required: true, type: 'string', pattern: /^[a-z0-9-]+$/ },
  filename: { required: true, type: 'string', pattern: /\.(jpg|jpeg|png|webp)$/i },
  altText: { required: true, type: 'string', minLength: 10 },
  caption: { required: false, type: 'string' },
  width: { required: false, type: 'number', min: 1 },
  height: { required: false, type: 'number', min: 1 }
};

// Error Types

export class DocumentationError extends Error {
  public code: string;
  
  constructor(message: string, code: string) {
    super(message);
    this.name = 'DocumentationError';
    this.code = code;
  }
}

export class NavigationError extends DocumentationError {
  constructor(sectionId: string, subsectionId?: string) {
    super(
      `Navigation failed: section '${sectionId}'${subsectionId ? `, subsection '${subsectionId}'` : ''} not found`,
      'NAVIGATION_ERROR'
    );
  }
}

export class ContentValidationError extends DocumentationError {
  constructor(field: string, value: any) {
    super(`Content validation failed: ${field} = ${JSON.stringify(value)}`, 'VALIDATION_ERROR');
  }
}