import React, { useMemo } from 'react';
import { TrendingUp, Users, Building2, Briefcase, ChevronUp, ChevronDown } from 'lucide-react';
import { useLeads } from '../context/LeadContext';
import { Card, CardContent } from './ui/Card';

export const Dashboard: React.FC = () => {
  const { leads } = useLeads();
  
  const metrics = useMemo(() => {
    const totalLeads = leads.length;
    const avgMatch = Math.round(
      leads.reduce((sum, lead) => sum + lead.percentageMatch, 0) / totalLeads || 0
    );
    
    const industries = leads.reduce((acc, lead) => {
      if (lead.industry) acc.add(lead.industry);
      return acc;
    }, new Set<string>());
    
    const positions = leads.reduce((acc, lead) => {
      if (lead.position) acc.add(lead.position);
      return acc;
    }, new Set<string>());
    
    const highPotentialLeads = leads.filter(lead => lead.percentageMatch >= 80).length;
    const highPotentialPercentage = Math.round((highPotentialLeads / totalLeads) * 100) || 0;
    
    return {
      totalLeads,
      avgMatch,
      uniqueIndustries: industries.size,
      uniquePositions: positions.size,
      highPotentialPercentage
    };
  }, [leads]);

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    trend,
    trendValue 
  }: { 
    title: string;
    value: number | string;
    icon: React.ElementType;
    trend?: 'up' | 'down';
    trendValue?: number;
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {title}
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {value}
              </p>
            </div>
          </div>
          {trend && trendValue !== undefined && (
            <div className={`flex items-center space-x-1 text-sm ${
              trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {trend === 'up' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              <span>{trendValue}%</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Total Leads"
        value={metrics.totalLeads}
        icon={Users}
      />
      <StatCard
        title="Average Match"
        value={`${metrics.avgMatch}%`}
        icon={TrendingUp}
        trend={metrics.avgMatch >= 50 ? 'up' : 'down'}
        trendValue={metrics.avgMatch}
      />
      <StatCard
        title="Industries"
        value={metrics.uniqueIndustries}
        icon={Building2}
      />
      <StatCard
        title="High Potential"
        value={`${metrics.highPotentialPercentage}%`}
        icon={Briefcase}
        trend={metrics.highPotentialPercentage >= 30 ? 'up' : 'down'}
        trendValue={metrics.highPotentialPercentage}
      />
    </div>
  );
};