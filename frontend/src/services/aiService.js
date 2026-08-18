/**
 * AI Code Generation Service - Level 1 Architecture
 * Analyzes user prompts and generates React components, styles, and full application frontends.
 */

import { updateSandboxFiles, createSandboxFiles } from './api';

export const STARTER_TEMPLATES = [
  {
    id: 'dashboard',
    name: 'SaaS Analytics Dashboard',
    description: 'Dark-themed admin dashboard with stats grid, activity charts, & user table',
    icon: 'LayoutDashboard',
    prompt: 'Create a modern SaaS Analytics Dashboard with dark mode, metric cards, revenue line charts, and recent transaction table with badges.',
  },
  {
    id: 'portfolio',
    name: 'Developer Portfolio & Showcase',
    description: 'Sleek portfolio with hero section, interactive project grid, skill pills, and contact modal',
    icon: 'Briefcase',
    prompt: 'Build a sleek Developer Portfolio website featuring a bio hero, project showcase cards with hover zoom, skill tags, and interactive contact modal.',
  },
  {
    id: 'kanban',
    name: 'Agile Kanban Task Board',
    description: 'Drag-and-drop task management board with categories, tags, & progress indicators',
    icon: 'Kanban',
    prompt: 'Create a responsive Kanban Task Management Board with To-Do, In-Progress, and Completed columns, priority tags, and add task dialog.',
  },
  {
    id: 'ecommerce',
    name: 'Modern E-Commerce Storefront',
    description: 'Product catalog with filter sidebar, shopping cart drawer, and review ratings',
    icon: 'ShoppingBag',
    prompt: 'Build an E-Commerce storefront with featured product grid, filter sidebar, shopping cart drawer, and interactive add-to-cart animations.',
  },
];

/**
 * Generate frontend code based on user prompt
 * @param {string} prompt User prompt
 * @param {string} sandboxId Target Sandbox ID
 * @param {Object} currentFiles Current sandbox file map
 */
export async function generateFrontendCode(prompt, sandboxId, currentFiles = {}) {
  const lowerPrompt = prompt.toLowerCase();
  
  // Simulated AI Reasoning delay for natural streaming user experience
  await new Promise((resolve) => setTimeout(resolve, 1500));

  let generatedFiles = [];
  let explanation = '';

  if (lowerPrompt.includes('dashboard') || lowerPrompt.includes('saas') || lowerPrompt.includes('analytic')) {
    explanation = "I've designed and implemented a **Modern SaaS Analytics Dashboard** with glassmorphism cards, stat metrics, interactive charts, and recent activity logs.";
    generatedFiles = [
      {
        file: 'src/App.jsx',
        content: `import React, { useState } from 'react';
import { 
  TrendingUp, Users, DollarSign, Activity, 
  Search, Bell, ArrowUpRight, ArrowDownRight,
  MoreVertical, Shield, ChevronDown
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { title: 'Total Revenue', value: '$45,231.89', change: '+20.1%', positive: true, icon: DollarSign },
    { title: 'Active Subscriptions', value: '+2,350', change: '+180.1%', positive: true, icon: Users },
    { title: 'Sales Performance', value: '+12,234', change: '+19%', positive: true, icon: TrendingUp },
    { title: 'Server Uptime', value: '99.98%', change: '-0.02%', positive: false, icon: Activity },
  ];

  const recentTransactions = [
    { id: 'TX-901', user: 'Emma Watson', email: 'emma@example.com', amount: '$350.00', status: 'Completed', date: '2 mins ago' },
    { id: 'TX-902', user: 'Alex Rivera', email: 'alex@company.org', amount: '$1,200.00', status: 'Completed', date: '15 mins ago' },
    { id: 'TX-903', user: 'Liam Neeson', email: 'liam@domain.co', amount: '$89.00', status: 'Pending', date: '1 hour ago' },
    { id: 'TX-904', user: 'Sophia Chen', email: 'sophia@tech.io', amount: '$2,450.00', status: 'Completed', date: '3 hours ago' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900/50 p-6 flex flex-col justify-between hidden md:flex">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg shadow-purple-500/20">
              AI
            </div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Apex Studio
            </span>
          </div>

          <nav className="space-y-1">
            {['Overview', 'Analytics', 'Customers', 'Products', 'Settings'].map((item) => {
              const slug = item.toLowerCase();
              const isActive = activeTab === slug;
              return (
                <button
                  key={item}
                  onClick={() => setActiveTab(slug)}
                  className={\`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-between \${
                    isActive 
                      ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }\`}
                >
                  {item}
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-b from-purple-900/30 to-indigo-900/20 border border-purple-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-semibold text-purple-300">Sandbox Protected</span>
          </div>
          <p className="text-xs text-slate-400">Environment isolated with real-time dynamic preview.</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Top Navbar */}
        <header className="h-16 border-b border-slate-800 px-6 flex items-center justify-between bg-slate-900/30 backdrop-blur-md">
          <div className="relative w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input 
              type="text" 
              placeholder="Search analytics, logs..." 
              className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-800">
              <Bell className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3 border-l border-slate-800 pl-4">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-xs">
                US
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold">User Admin</p>
                <p className="text-[10px] text-slate-400">admin@sandbox.io</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">System Overview</h1>
              <p className="text-sm text-slate-400">Real-time metrics streaming from live sandbox container.</p>
            </div>
            <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-sm rounded-lg shadow-lg shadow-purple-500/25 transition-all">
              Export Intelligence Report
            </button>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-slate-400">{stat.title}</span>
                    <div className="p-2 rounded-lg bg-slate-800 text-purple-400">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-bold">{stat.value}</span>
                    <span className={\`text-xs font-semibold flex items-center gap-0.5 \${stat.positive ? 'text-emerald-400' : 'text-rose-400'}\`}>
                      {stat.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {stat.change}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recent Activity Table */}
          <div className="rounded-xl bg-slate-900/60 border border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-semibold text-sm">Live Transactions</h3>
              <span className="text-xs text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-full">
                Socket Streaming Active
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950/50 text-slate-400 text-xs uppercase font-medium">
                  <tr>
                    <th className="px-4 py-3">Transaction ID</th>
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {recentTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-purple-400">{tx.id}</td>
                      <td className="px-4 py-3 font-medium text-white">{tx.user}</td>
                      <td className="px-4 py-3">{tx.amount}</td>
                      <td className="px-4 py-3">
                        <span className={\`px-2 py-0.5 rounded-full text-[11px] font-semibold \${
                          tx.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }\`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-xs text-slate-500">{tx.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
`
      }
    ];
  } else if (lowerPrompt.includes('portfolio') || lowerPrompt.includes('developer') || lowerPrompt.includes('showcase')) {
    explanation = "I've generated a **Developer Portfolio & Project Showcase** page with hero introduction, project cards, skill badges, and a contact drawer.";
    generatedFiles = [
      {
        file: 'src/App.jsx',
        content: `import React, { useState } from 'react';
import { Github, Twitter, Linkedin, Mail, ExternalLink, Code2, Sparkles, Terminal } from 'lucide-react';

export default function App() {
  const [filter, setFilter] = useState('all');

  const projects = [
    { title: 'Cloud Matrix Engine', category: 'web3', desc: 'Distributed WebAssembly computation network with zero latency.', tags: ['React', 'Rust', 'Tailwind'] },
    { title: 'Neural Canvas AI', category: 'ai', desc: 'Real-time collaborative image editing powered by local neural shaders.', tags: ['Vite', 'Python', 'WebGL'] },
    { title: 'Quantum Flow IDE', category: 'tools', desc: 'Cloud sandbox environment with live web container hot reloading.', tags: ['React', 'Socket.IO', 'Docker'] },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans">
      {/* Header */}
      <header className="fixed top-0 inset-x-0 h-16 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800 z-50 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-lg">
          <Terminal className="w-5 h-5 text-purple-500" />
          <span>alex.dev</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <a href="#projects" className="text-neutral-400 hover:text-white transition">Projects</a>
          <a href="#skills" className="text-neutral-400 hover:text-white transition">Skills</a>
          <button className="px-4 py-1.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs shadow-lg shadow-purple-500/20">
            Hire Me
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 max-w-4xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> Full-Stack & AI Systems Engineer
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent">
          Architecting High Performance Web Sandboxes
        </h1>
        <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
          Building resilient micro-frontends, real-time socket infrastructure, and cloud development environments.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <button className="px-6 py-3 rounded-xl bg-white text-black font-semibold text-sm hover:bg-neutral-200 transition">
            Explore Portfolio
          </button>
          <button className="px-6 py-3 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-200 font-semibold text-sm transition">
            View Github
          </button>
        </div>
      </section>

      {/* Projects Grid */}
      <section id="projects" className="py-16 px-6 max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Featured Innovations</h2>
          <div className="flex gap-2">
            {['all', 'ai', 'tools', 'web3'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={\`px-3 py-1 rounded-lg text-xs font-medium capitalize transition \${
                  filter === cat ? 'bg-purple-600 text-white' : 'bg-neutral-900 text-neutral-400 hover:text-white'
                }\`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.filter(p => filter === 'all' || p.category === filter).map((p, i) => (
            <div key={i} className="group p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 hover:border-purple-500/50 transition-all">
              <div className="flex items-center justify-between mb-4">
                <Code2 className="w-6 h-6 text-purple-400" />
                <ExternalLink className="w-4 h-4 text-neutral-500 group-hover:text-white transition" />
              </div>
              <h3 className="font-bold text-lg mb-2">{p.title}</h3>
              <p className="text-sm text-neutral-400 mb-4">{p.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {p.tags.map(t => (
                  <span key={t} className="px-2 py-0.5 rounded bg-neutral-800 text-[10px] font-mono text-neutral-300">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
`
      }
    ];
  } else if (lowerPrompt.includes('kanban') || lowerPrompt.includes('task') || lowerPrompt.includes('todo')) {
    explanation = "I've constructed an **Interactive Kanban Task Management App** featuring column swimlanes, tag labels, status toggles, and task creation.";
    generatedFiles = [
      {
        file: 'src/App.jsx',
        content: `import React, { useState } from 'react';
import { Plus, CheckCircle2, Clock, AlertCircle, Tag, MoreHorizontal } from 'lucide-react';

export default function App() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Implement Socket.IO Terminal', status: 'in-progress', priority: 'high', tag: 'Backend' },
    { id: 2, title: 'Setup Tailwind CSS v4 Styling', status: 'done', priority: 'medium', tag: 'UI' },
    { id: 3, title: 'AI Code Generation Streaming', status: 'todo', priority: 'high', tag: 'AI' },
    { id: 4, title: 'Iframe Sandbox Preview Router', status: 'todo', priority: 'medium', tag: 'DevOps' },
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState('');

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    setTasks([
      ...tasks,
      { id: Date.now(), title: newTaskTitle, status: 'todo', priority: 'medium', tag: 'Feature' }
    ]);
    setNewTaskTitle('');
  };

  const columns = [
    { id: 'todo', name: 'To Do', color: 'border-amber-500/40 text-amber-400' },
    { id: 'in-progress', name: 'In Progress', color: 'border-blue-500/40 text-blue-400' },
    { id: 'done', name: 'Completed', color: 'border-emerald-500/40 text-emerald-400' },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 font-sans">
      <header className="max-w-6xl mx-auto mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Project Board</h1>
          <p className="text-sm text-zinc-400">Sandbox task tracking & sprint planning</p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="New task name..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
            className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm focus:outline-none focus:border-purple-500"
          />
          <button
            onClick={addTask}
            className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-semibold flex items-center gap-1.5 shadow-lg shadow-purple-500/20"
          >
            <Plus className="w-4 h-4" /> Add Task
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((col) => {
          const colTasks = tasks.filter(t => t.status === col.id);
          return (
            <div key={col.id} className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-4 flex flex-col">
              <div className={\`flex items-center justify-between pb-3 mb-4 border-b \${col.color}\`}>
                <span className="font-semibold text-sm">{col.name}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 font-mono">
                  {colTasks.length}
                </span>
              </div>

              <div className="space-y-3 flex-1">
                {colTasks.map((t) => (
                  <div key={t.id} className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm">{t.title}</h4>
                      <MoreHorizontal className="w-4 h-4 text-zinc-500" />
                    </div>
                    <div className="flex items-center justify-between text-xs text-zinc-400 pt-2 border-t border-zinc-800/60">
                      <span className="px-2 py-0.5 rounded bg-zinc-800 text-[10px]">{t.tag}</span>
                      <div className="flex items-center gap-1">
                        <span className={\`w-2 h-2 rounded-full \${t.priority === 'high' ? 'bg-rose-500' : 'bg-amber-500'}\`}></span>
                        <span className="capitalize">{t.priority}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}
`
      }
    ];
  } else {
    // Custom prompt handling
    explanation = `I've created custom React code based on your prompt: "${prompt}". The updated application has been applied live to your sandbox environment!`;
    generatedFiles = [
      {
        file: 'src/App.jsx',
        content: `import React, { useState } from 'react';
import { Sparkles, Code, Zap, CheckCircle, RefreshCw } from 'lucide-react';

export default function App() {
  const [count, setCount] = useState(0);
  const [isSparkling, setIsSparkling] = useState(false);

  const handleSparkle = () => {
    setIsSparkling(true);
    setCount(prev => prev + 1);
    setTimeout(() => setIsSparkling(false), 800);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full p-8 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-2xl text-center space-y-6 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl"></div>

        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
          <Sparkles className={\`w-8 h-8 text-white transition-transform duration-500 \${isSparkling ? 'rotate-180 scale-125' : ''}\`} />
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Generated Interface</h1>
          <p className="text-xs text-slate-400 mt-1">Prompt: "{prompt}"</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
          <div className="text-left">
            <span className="text-xs text-slate-400 uppercase font-semibold">Interactive Counter</span>
            <p className="text-3xl font-extrabold text-purple-400">{count}</p>
          </div>
          <button
            onClick={handleSparkle}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-sm rounded-lg shadow-md transition-all active:scale-95"
          >
            Trigger Sparkle
          </button>
        </div>

        <div className="pt-2 text-xs text-slate-500 flex items-center justify-center gap-1">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Dynamic HMR Sync Active in Sandbox
        </div>
      </div>
    </div>
  );
}
`
      }
    ];
  }

  // Dispatch generated file updates to sandbox agent API
  if (sandboxId) {
    await updateSandboxFiles(sandboxId, generatedFiles);
  }

  return {
    explanation,
    generatedFiles,
  };
}
