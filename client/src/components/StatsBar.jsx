import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import useStore from '../store/useStore';

const StatsBar = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });
  const { lang } = useStore();

  const t = {
    en: {
      beneficiaries: 'Beneficiaries',
      projects: 'Active Projects',
      countries: 'Countries',
      funds: 'Funds Raised'
    },
    hi: {
      beneficiaries: 'लाभार्थी',
      projects: 'सक्रिय परियोजनाएं',
      countries: 'देश',
      funds: 'जुटाए गए फंड'
    }
  };

  const { data: statsData } = useQuery({
    queryKey: ['platformStats'],
    queryFn: async () => {
      const res = await api.get('/stats');
      return res.data.data;
    }
  });

  const stats = [
    { label: t[lang].beneficiaries, value: statsData?.livesImpacted || 0, prefix: '', suffix: '+' },
    { label: t[lang].projects, value: statsData?.activeProjects || 0, prefix: '', suffix: '' },
    { label: t[lang].countries, value: statsData?.countries || 1, prefix: '', suffix: '' },
    { label: t[lang].funds, value: statsData?.fundsRaised || 0, prefix: '₹', suffix: '' }
  ];

  return (
    <div className="stats-wrapper" ref={ref}>
      <div className="container">
        <div className="stats-grid glass">
          {stats.map((stat, idx) => (
            <div key={idx} className="stat-item">
              <h3 className="stat-value text-secondary">
                {stat.prefix}
                {inView ? <CountUp end={stat.value} duration={2.5} separator="," /> : '0'}
                {stat.suffix}
              </h3>
              <p className="stat-label">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .stats-wrapper {
          margin-top: -60px;
          position: relative;
          z-index: 20;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          border-radius: var(--radius-lg);
          overflow: hidden;
          background: var(--white);
          box-shadow: var(--shadow-lg);
        }
        .stat-item {
          padding: 40px 20px;
          text-align: center;
          border-right: 1px solid rgba(0,0,0,0.05);
        }
        .stat-item:last-child {
          border-right: none;
        }
        .stat-value {
          font-size: 2.5rem;
          margin-bottom: 8px;
        }
        .stat-label {
          color: var(--muted);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-size: 0.9rem;
        }
        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr 1fr;
          }
          .stat-item {
            padding: 24px 16px;
            border-bottom: 1px solid rgba(0,0,0,0.05);
          }
          .stat-item:nth-child(even) {
            border-right: none;
          }
        }
      `}</style>
    </div>
  );
};

export default StatsBar;
