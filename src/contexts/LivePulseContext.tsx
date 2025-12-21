import React, { createContext, useContext, useState, ReactNode } from 'react';

export type SignalImpact = 'low' | 'medium' | 'high';
export type InsightType = 'risk' | 'opportunity';
export type InsightStatus = 'observation' | 'action' | 'implemented';
export type ActionStatus = 'proposed' | 'testing' | 'implemented' | 'measured';
export type SpaceType = 'personal' | 'team' | 'organization';
export type PeriodType = '7d' | '30d' | '90d';

export interface Signal {
  id: string;
  observation: string;
  probableCause?: string;
  impact: SignalImpact;
  proposedLever?: string;
  team: string;
  project?: string;
  location?: string;
  createdAt: Date;
  usedInInsights: string[];
}

export interface Insight {
  id: string;
  title: string;
  summary: string;
  signalIds: string[];
  type: InsightType;
  confidenceScore: number;
  status: InsightStatus;
  teams: string[];
  impactScore: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Action {
  id: string;
  insightId: string;
  title: string;
  owner: string;
  deadline: Date;
  expectedImpact: number;
  measuredImpact?: number;
  status: ActionStatus;
  createdAt: Date;
}

interface LivePulseContextType {
  signals: Signal[];
  insights: Insight[];
  actions: Action[];
  currentSpace: SpaceType;
  currentPeriod: PeriodType;
  setCurrentSpace: (space: SpaceType) => void;
  setCurrentPeriod: (period: PeriodType) => void;
  addSignal: (signal: Omit<Signal, 'id' | 'createdAt' | 'usedInInsights'>) => void;
  addInsight: (insight: Omit<Insight, 'id' | 'createdAt' | 'updatedAt'>) => void;
  addAction: (action: Omit<Action, 'id' | 'createdAt'>) => void;
  updateActionStatus: (id: string, status: ActionStatus) => void;
  updateInsightStatus: (id: string, status: InsightStatus) => void;
}

const defaultSignals: Signal[] = [
  {
    id: 's1',
    observation: 'Les réunions de sprint durent en moyenne 30min de plus que prévu',
    probableCause: 'Manque de préparation avant les réunions',
    impact: 'medium',
    proposedLever: 'Envoyer un agenda 24h avant avec les points à préparer',
    team: 'Engineering',
    project: 'Sprint Planning',
    createdAt: new Date('2024-01-15'),
    usedInInsights: ['i1']
  },
  {
    id: 's2',
    observation: 'Augmentation de 40% des tickets support liés à la facturation',
    probableCause: 'Nouvelle interface de paiement mal comprise',
    impact: 'high',
    proposedLever: 'Ajouter un tutoriel interactif à la première utilisation',
    team: 'Product',
    project: 'Billing System',
    createdAt: new Date('2024-01-14'),
    usedInInsights: ['i2']
  },
  {
    id: 's3',
    observation: 'Baisse de participation aux sessions de feedback',
    impact: 'low',
    team: 'HR',
    createdAt: new Date('2024-01-13'),
    usedInInsights: []
  },
  {
    id: 's4',
    observation: 'Les développeurs passent 25% de leur temps sur des tâches non-techniques',
    probableCause: 'Processus administratifs trop lourds',
    impact: 'high',
    proposedLever: 'Automatiser les rapports hebdomadaires',
    team: 'Engineering',
    createdAt: new Date('2024-01-12'),
    usedInInsights: ['i1']
  },
  {
    id: 's5',
    observation: 'Forte adoption de la nouvelle feature analytics',
    impact: 'medium',
    team: 'Product',
    createdAt: new Date('2024-01-11'),
    usedInInsights: ['i3']
  }
];

const defaultInsights: Insight[] = [
  {
    id: 'i1',
    title: 'Inefficience dans les processus Engineering',
    summary: 'Plusieurs signaux indiquent une perte de temps significative due aux processus. Impact estimé: 15% de productivité perdue.',
    signalIds: ['s1', 's4'],
    type: 'risk',
    confidenceScore: 85,
    status: 'action',
    teams: ['Engineering'],
    impactScore: 78,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-16')
  },
  {
    id: 'i2',
    title: 'Friction UX sur le système de facturation',
    summary: 'L\'augmentation des tickets support suggère un problème d\'utilisabilité majeur sur la nouvelle interface.',
    signalIds: ['s2'],
    type: 'risk',
    confidenceScore: 92,
    status: 'observation',
    teams: ['Product', 'Support'],
    impactScore: 85,
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14')
  },
  {
    id: 'i3',
    title: 'Opportunité d\'expansion analytics',
    summary: 'L\'adoption rapide de la feature analytics indique un fort intérêt pour les outils de data visualization.',
    signalIds: ['s5'],
    type: 'opportunity',
    confidenceScore: 75,
    status: 'observation',
    teams: ['Product'],
    impactScore: 65,
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-12')
  }
];

const defaultActions: Action[] = [
  {
    id: 'a1',
    insightId: 'i1',
    title: 'Automatiser les rapports hebdomadaires',
    owner: 'Marie Dupont',
    deadline: new Date('2024-02-15'),
    expectedImpact: 20,
    status: 'testing',
    createdAt: new Date('2024-01-16')
  },
  {
    id: 'a2',
    insightId: 'i1',
    title: 'Restructurer le format des réunions sprint',
    owner: 'Thomas Martin',
    deadline: new Date('2024-02-01'),
    expectedImpact: 15,
    measuredImpact: 12,
    status: 'measured',
    createdAt: new Date('2024-01-16')
  },
  {
    id: 'a3',
    insightId: 'i2',
    title: 'Créer un tutoriel interactif facturation',
    owner: 'Sophie Bernard',
    deadline: new Date('2024-02-28'),
    expectedImpact: 35,
    status: 'proposed',
    createdAt: new Date('2024-01-15')
  }
];

const LivePulseContext = createContext<LivePulseContextType | undefined>(undefined);

export const LivePulseProvider = ({ children }: { children: ReactNode }) => {
  const [signals, setSignals] = useState<Signal[]>(defaultSignals);
  const [insights, setInsights] = useState<Insight[]>(defaultInsights);
  const [actions, setActions] = useState<Action[]>(defaultActions);
  const [currentSpace, setCurrentSpace] = useState<SpaceType>('team');
  const [currentPeriod, setCurrentPeriod] = useState<PeriodType>('30d');

  const addSignal = (signal: Omit<Signal, 'id' | 'createdAt' | 'usedInInsights'>) => {
    const newSignal: Signal = {
      ...signal,
      id: `s${Date.now()}`,
      createdAt: new Date(),
      usedInInsights: []
    };
    setSignals(prev => [newSignal, ...prev]);
  };

  const addInsight = (insight: Omit<Insight, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newInsight: Insight = {
      ...insight,
      id: `i${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setInsights(prev => [newInsight, ...prev]);
  };

  const addAction = (action: Omit<Action, 'id' | 'createdAt'>) => {
    const newAction: Action = {
      ...action,
      id: `a${Date.now()}`,
      createdAt: new Date()
    };
    setActions(prev => [newAction, ...prev]);
  };

  const updateActionStatus = (id: string, status: ActionStatus) => {
    setActions(prev =>
      prev.map(action =>
        action.id === id ? { ...action, status } : action
      )
    );
  };

  const updateInsightStatus = (id: string, status: InsightStatus) => {
    setInsights(prev =>
      prev.map(insight =>
        insight.id === id ? { ...insight, status, updatedAt: new Date() } : insight
      )
    );
  };

  return (
    <LivePulseContext.Provider value={{
      signals,
      insights,
      actions,
      currentSpace,
      currentPeriod,
      setCurrentSpace,
      setCurrentPeriod,
      addSignal,
      addInsight,
      addAction,
      updateActionStatus,
      updateInsightStatus
    }}>
      {children}
    </LivePulseContext.Provider>
  );
};

export const useLivePulse = () => {
  const context = useContext(LivePulseContext);
  if (context === undefined) {
    throw new Error('useLivePulse must be used within a LivePulseProvider');
  }
  return context;
};
