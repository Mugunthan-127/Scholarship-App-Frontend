import React, { useState } from 'react';
import { BarChart3, X, Minimize2, Maximize2, Download, TrendingUp, Users, FileText, Award, Activity, RefreshCw } from 'lucide-react';

export default function FloatingAnalytics() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('month');
  const [isLoading, setIsLoading] = useState(false);

  const analyticsData = {
    overview: {
      totalApplications: 1248,
      approvedApplications: 856,
      rejectedApplications: 234,
      pendingApplications: 158,
      successRate: 68.6,
      monthlyGrowth: 12.3
    },
    scholarships: [
      { name: 'Merit Based', students: 145, budget: 58000, color: '#3b82f6', growth: 15.2 },
      { name: 'Need Based', students: 98, budget: 42000, color: '#10b981', growth: 8.7 },
      { name: 'Sports', students: 67, budget: 28000, color: '#f59e0b', growth: -3.1 },
      { name: 'Research', students: 43, budget: 18000, color: '#8b5cf6', growth: 22.4 },
      { name: 'Arts', students: 29, budget: 12000, color: '#ef4444', growth: 5.8 }
    ],
    monthlyTrends: [
      { month: 'Jan', applications: 89 },
      { month: 'Feb', applications: 112 },
      { month: 'Mar', applications: 98 },
      { month: 'Apr', applications: 134 },
      { month: 'May', applications: 156 },
      { month: 'Jun', applications: 187 }
    ],
    demographics: [
      { category: 'Undergraduate', percentage: 65, count: 812, color: '#3b82f6' },
      { category: 'Graduate', percentage: 25, count: 312, color: '#10b981' },
      { category: 'PhD', percentage: 10, count: 124, color: '#f59e0b' }
    ]
  };

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  const exportData = () => {
    const dataStr = JSON.stringify(analyticsData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `analytics_${timeRange}_${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const StatCard = ({ icon: Icon, title, value, change, color, suffix = '' }) => (
    <div style={{
      background: 'white',
      padding: '16px',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      border: '1px solid #f1f5f9',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      transition: 'all 0.2s ease'
    }}>
      <div style={{
        width: '36px',
        height: '36px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: `${color}20`,
        color: color
      }}>
        <Icon size={18} />
      </div>
      <div style={{ flex: 1 }}>
        <h4 style={{
          color: '#6b7280',
          fontSize: '11px',
          fontWeight: '500',
          margin: '0 0 4px 0',
          textTransform: 'uppercase'
        }}>{title}</h4>
        <p style={{
          fontSize: '20px',
          fontWeight: '700',
          color: '#1f2937',
          margin: '0 0 2px 0'
        }}>{value}{suffix}</p>
        <span style={{
          fontSize: '11px',
          fontWeight: '500',
          color: change >= 0 ? '#10b981' : '#ef4444'
        }}>
          {change >= 0 ? '↗' : '↘'} {Math.abs(change)}%
        </span>
      </div>
    </div>
  );

  const BarChart = ({ data, height = 120 }) => {
    const maxValue = Math.max(...data.map(d => d.applications));
    
    return (
      <div style={{
        display: 'flex',
        alignItems: 'end',
        gap: '8px',
        padding: '16px 0',
        height
      }}>
        {data.map((item, index) => (
          <div key={index} style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{
              width: '100%',
              background: 'linear-gradient(to top, #f093fb, #f5576c)',
              borderRadius: '4px 4px 0 0',
              height: `${(item.applications / maxValue) * (height - 40)}px`,
              minHeight: '20px',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              paddingTop: '4px',
              color: 'white',
              fontSize: '10px',
              fontWeight: '600'
            }}>
              {item.applications}
            </div>
            <div style={{
              fontSize: '11px',
              color: '#6b7280',
              fontWeight: '500'
            }}>{item.month}</div>
          </div>
        ))}
      </div>
    );
  };

  const PieChart = ({ data }) => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '20px'
    }}>
      <div style={{ position: 'relative' }}>
        <svg width="100" height="100" style={{ transform: 'rotate(-90deg)' }}>
          {data.map((item, index) => {
            const percentage = item.percentage;
            const strokeDasharray = `${percentage} ${100 - percentage}`;
            const strokeDashoffset = data.slice(0, index).reduce((sum, d) => sum + d.percentage, 0) * -1;
            
            return (
              <circle
                key={index}
                cx="50"
                cy="50"
                r="15.915"
                fill="transparent"
                stroke={item.color}
                strokeWidth="8"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
              />
            );
          })}
        </svg>
      </div>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        {data.map((item, index) => (
          <div key={index} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: item.color
            }}></div>
            <span style={{ flex: 1, color: '#374151' }}>{item.category}</span>
            <span style={{ fontWeight: '600', color: '#1f2937' }}>{item.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <StatCard
                icon={FileText}
                title="Applications"
                value={analyticsData.overview.totalApplications}
                change={analyticsData.overview.monthlyGrowth}
                color="#3b82f6"
              />
              <StatCard
                icon={Award}
                title="Success Rate"
                value={analyticsData.overview.successRate}
                change={5.2}
                color="#10b981"
                suffix="%"
              />
            </div>
            
            <div style={{
              background: 'white',
              padding: '16px',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #f1f5f9'
            }}>
              <h4 style={{
                margin: '0 0 16px 0',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1f2937'
              }}>Application Status Breakdown</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { name: 'Approved', count: analyticsData.overview.approvedApplications, color: '#10b981' },
                  { name: 'Pending', count: analyticsData.overview.pendingApplications, color: '#f59e0b' },
                  { name: 'Rejected', count: analyticsData.overview.rejectedApplications, color: '#ef4444' }
                ].map((status, index) => (
                  <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      <span>{status.name}</span>
                      <span>{status.count}</span>
                    </div>
                    <div style={{
                      height: '6px',
                      background: '#f3f4f6',
                      borderRadius: '3px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        background: status.color,
                        borderRadius: '3px',
                        width: `${(status.count / analyticsData.overview.totalApplications) * 100}%`,
                        transition: 'width 1s ease'
                      }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'trends':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{
              background: 'white',
              padding: '16px',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #f1f5f9'
            }}>
              <h4 style={{
                margin: '0 0 16px 0',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1f2937'
              }}>Monthly Application Trends</h4>
              <BarChart data={analyticsData.monthlyTrends} />
            </div>
            
            <div style={{
              background: 'white',
              padding: '16px',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #f1f5f9'
            }}>
              <h4 style={{
                margin: '0 0 16px 0',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1f2937'
              }}>Growth Metrics</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {analyticsData.scholarships.slice(0, 3).map((scholarship, index) => (
                  <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{
                        fontSize: '12px',
                        color: '#374151',
                        fontWeight: '500'
                      }}>{scholarship.name}</span>
                      <span style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        color: scholarship.growth >= 0 ? '#10b981' : '#ef4444'
                      }}>
                        {scholarship.growth >= 0 ? '+' : ''}{scholarship.growth}%
                      </span>
                    </div>
                    <div style={{
                      height: '4px',
                      background: '#f3f4f6',
                      borderRadius: '2px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        borderRadius: '2px',
                        backgroundColor: scholarship.color,
                        width: `${Math.abs(scholarship.growth) * 2}%`,
                        transition: 'width 1s ease'
                      }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'demographics':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{
              background: 'white',
              padding: '16px',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #f1f5f9'
            }}>
              <h4 style={{
                margin: '0 0 16px 0',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1f2937'
              }}>Student Demographics</h4>
              <PieChart data={analyticsData.demographics} />
            </div>
            
            <div style={{
              background: 'white',
              padding: '16px',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #f1f5f9'
            }}>
              <h4 style={{
                margin: '0 0 16px 0',
                fontSize: '14px',
                fontWeight: '600',
                color: '#1f2937'
              }}>Scholarship Distribution</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {analyticsData.scholarships.map((scholarship, index) => (
                  <div key={index} style={{
                    background: '#f9fafb',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginBottom: '6px'
                    }}>
                      <div style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: scholarship.color
                      }}></div>
                      <span style={{
                        flex: 1,
                        fontSize: '13px',
                        fontWeight: '500',
                        color: '#374151'
                      }}>{scholarship.name}</span>
                      <span style={{
                        background: '#e5e7eb',
                        color: '#6b7280',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '600'
                      }}>{scholarship.students}</span>
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#10b981',
                      fontWeight: '600',
                      marginLeft: '20px'
                    }}>${scholarship.budget.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Floating Analytics Button */}
      <div style={{
        position: 'fixed',
        bottom: '100px',
        right: '24px',
        zIndex: 1000,
        opacity: isOpen ? 0 : 1,
        pointerEvents: isOpen ? 'none' : 'auto',
        transform: isOpen ? 'scale(0.8)' : 'scale(1)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <button
          onClick={() => setIsOpen(true)}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(240, 147, 251, 0.3)',
            transition: 'all 0.3s ease',
            position: 'relative'
          }}
        >
          <BarChart3 size={24} />
        </button>
      </div>

      {/* Analytics Panel */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '420px',
          height: isMinimized ? '60px' : '650px',
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
          zIndex: 1001,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(20px)'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <BarChart3 size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Analytics Dashboard</h3>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  opacity: 0.9,
                  marginTop: '2px'
                }}>
                  <Activity size={12} />
                  <span>Live Data</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                onClick={refreshData}
                disabled={isLoading}
                style={{
                  width: '32px',
                  height: '32px',
                  border: 'none',
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <RefreshCw size={16} style={{ 
                  animation: isLoading ? 'spin 1s linear infinite' : 'none'
                }} />
              </button>
              <button
                onClick={exportData}
                style={{
                  width: '32px',
                  height: '32px',
                  border: 'none',
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Download size={16} />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                style={{
                  width: '32px',
                  height: '32px',
                  border: 'none',
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  width: '32px',
                  height: '32px',
                  border: 'none',
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Time Range Selector */}
              <div style={{ display: 'flex', padding: '16px 20px 0', gap: '8px' }}>
                {['week', 'month', 'quarter', 'year'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    style={{
                      padding: '6px 12px',
                      border: '1px solid #e5e7eb',
                      background: timeRange === range ? 'linear-gradient(135deg, #f093fb, #f5576c)' : 'white',
                      color: timeRange === range ? 'white' : '#6b7280',
                      borderColor: timeRange === range ? 'transparent' : '#e5e7eb',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '500',
                      textTransform: 'capitalize'
                    }}
                  >
                    {range}
                  </button>
                ))}
              </div>

              {/* Tab Navigation */}
              <div style={{
                display: 'flex',
                padding: '16px 20px 0',
                borderBottom: '1px solid #e5e7eb'
              }}>
                <button
                  onClick={() => setActiveTab('overview')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    border: 'none',
                    background: 'transparent',
                    color: activeTab === 'overview' ? '#f5576c' : '#6b7280',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '500',
                    borderBottom: `2px solid ${activeTab === 'overview' ? '#f5576c' : 'transparent'}`,
                    flex: 1,
                    justifyContent: 'center'
                  }}
                >
                  <TrendingUp size={16} />
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('trends')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    border: 'none',
                    background: 'transparent',
                    color: activeTab === 'trends' ? '#f5576c' : '#6b7280',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '500',
                    borderBottom: `2px solid ${activeTab === 'trends' ? '#f5576c' : 'transparent'}`,
                    flex: 1,
                    justifyContent: 'center'
                  }}
                >
                  <Activity size={16} />
                  Trends
                </button>
                <button
                  onClick={() => setActiveTab('demographics')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    border: 'none',
                    background: 'transparent',
                    color: activeTab === 'demographics' ? '#f5576c' : '#6b7280',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '500',
                    borderBottom: `2px solid ${activeTab === 'demographics' ? '#f5576c' : 'transparent'}`,
                    flex: 1,
                    justifyContent: 'center'
                  }}
                >
                  <Users size={16} />
                  Demographics
                </button>
              </div>

              {/* Content Area */}
              <div style={{
                flex: 1,
                padding: '20px',
                overflowY: 'auto',
                background: '#fafbfc'
              }}>
                {isLoading ? (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '200px',
                    gap: '16px'
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      border: '3px solid #e5e7eb',
                      borderTop: '3px solid #f5576c',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    <p>Loading fresh data...</p>
                  </div>
                ) : (
                  renderTabContent()
                )}
              </div>

              {/* Footer */}
              <div style={{
                padding: '12px 20px',
                background: '#f9fafb',
                borderTop: '1px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '11px',
                color: '#6b7280'
              }}>
                <span>Last updated: {new Date().toLocaleTimeString()}</span>
                <span>•</span>
                <span>Auto-refresh: ON</span>
              </div>
            </>
          )}
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}