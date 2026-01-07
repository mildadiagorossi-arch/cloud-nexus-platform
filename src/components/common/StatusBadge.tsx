import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type StatusType = 
  | 'active' 
  | 'running' 
  | 'pending' 
  | 'processing' 
  | 'offline' 
  | 'error' 
  | 'cancelled'
  | 'success'
  | 'warning'
  | 'info';

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  className?: string;
}

const statusConfig: Record<StatusType, { color: string; label: string }> = {
  active: { color: 'bg-green-500/10 text-green-600 border-green-500/20', label: 'Actif' },
  running: { color: 'bg-green-500/10 text-green-600 border-green-500/20', label: 'En cours' },
  pending: { color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20', label: 'En attente' },
  processing: { color: 'bg-blue-500/10 text-blue-600 border-blue-500/20', label: 'Traitement' },
  offline: { color: 'bg-red-500/10 text-red-600 border-red-500/20', label: 'Hors ligne' },
  error: { color: 'bg-red-500/10 text-red-600 border-red-500/20', label: 'Erreur' },
  cancelled: { color: 'bg-gray-500/10 text-gray-600 border-gray-500/20', label: 'Annulé' },
  success: { color: 'bg-green-500/10 text-green-600 border-green-500/20', label: 'Succès' },
  warning: { color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20', label: 'Attention' },
  info: { color: 'bg-blue-500/10 text-blue-600 border-blue-500/20', label: 'Info' },
};

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <Badge 
      variant="outline" 
      className={cn(config.color, 'font-medium', className)}
    >
      <span className={cn(
        'w-2 h-2 rounded-full mr-2',
        status === 'active' || status === 'running' || status === 'success' ? 'bg-green-500' :
        status === 'pending' || status === 'warning' ? 'bg-yellow-500' :
        status === 'processing' || status === 'info' ? 'bg-blue-500' :
        status === 'offline' || status === 'error' ? 'bg-red-500' :
        'bg-gray-500'
      )} />
      {label || config.label}
    </Badge>
  );
}

export default StatusBadge;
