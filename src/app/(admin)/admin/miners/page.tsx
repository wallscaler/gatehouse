"use client";

import { useState } from "react";
import {
  Pickaxe,
  MapPin,
  Server,
  Eye,
  Ban,
  ChevronDown,
  ChevronUp,
  Wallet,
  Globe,
  User,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type MinerStatus = "active" | "suspended" | "inactive";

interface Miner {
  id: string;
  name: string;
  ownerName: string;
  ownerEmail: string;
  location: string;
  resourceCount: number;
  status: MinerStatus;
  totalEarnings: number;
  monthlyEarnings: number;
  hotkey: string;
  coldkey: string;
  uid: number;
  registeredAt: string;
  lastSeen: string;
}

const mockMiners: Miner[] = [
  {
    id: "miner-001",
    name: "MinerNaija",
    ownerName: "Adebayo Ogunleye",
    ownerEmail: "adebayo@minernaija.ng",
    location: "Lagos, Nigeria",
    resourceCount: 3,
    status: "active",
    totalEarnings: 12.45,
    monthlyEarnings: 2.3,
    hotkey: "5GrwvaEF...jMakdg",
    coldkey: "5FHneW46...xPBqk9",
    uid: 147,
    registeredAt: "2025-09-15",
    lastSeen: "2026-02-07",
  },
  {
    id: "miner-002",
    name: "AccraCompute",
    ownerName: "Kwame Asante",
    ownerEmail: "kwame@accracompute.gh",
    location: "Accra, Ghana",
    resourceCount: 2,
    status: "active",
    totalEarnings: 18.72,
    monthlyEarnings: 3.1,
    hotkey: "5DAAnrj7...VjeLx5",
    coldkey: "5HGjWAe...Rq4nAp",
    uid: 89,
    registeredAt: "2025-08-20",
    lastSeen: "2026-02-07",
  },
  {
    id: "miner-003",
    name: "NairobiGPU",
    ownerName: "Samuel Kariuki",
    ownerEmail: "samuel@nairobigpu.ke",
    location: "Nairobi, Kenya",
    resourceCount: 1,
    status: "active",
    totalEarnings: 7.89,
    monthlyEarnings: 1.4,
    hotkey: "5FLSigC...dGN3wx",
    coldkey: "5Ew2MVz...FqTdPk",
    uid: 203,
    registeredAt: "2025-10-05",
    lastSeen: "2026-02-06",
  },
  {
    id: "miner-004",
    name: "DakarNodes",
    ownerName: "Fatima Diallo",
    ownerEmail: "fatima@dakarnodes.sn",
    location: "Dakar, Senegal",
    resourceCount: 1,
    status: "active",
    totalEarnings: 5.21,
    monthlyEarnings: 0.9,
    hotkey: "5CiPPseX...fEoQBT",
    coldkey: "5GNJqTP...vRcAkw",
    uid: 312,
    registeredAt: "2025-12-01",
    lastSeen: "2026-02-07",
  },
  {
    id: "miner-005",
    name: "KigaliCompute",
    ownerName: "Jean-Pierre Habimana",
    ownerEmail: "jp@kigalicompute.rw",
    location: "Kigali, Rwanda",
    resourceCount: 1,
    status: "active",
    totalEarnings: 3.67,
    monthlyEarnings: 1.8,
    hotkey: "5HpG9w8...EzLDhb",
    coldkey: "5CRmqm...HbUpRr",
    uid: 401,
    registeredAt: "2025-11-20",
    lastSeen: "2026-02-07",
  },
  {
    id: "miner-006",
    name: "CapeGPU",
    ownerName: "Thabo Nkosi",
    ownerEmail: "thabo@capegpu.za",
    location: "Cape Town, South Africa",
    resourceCount: 1,
    status: "active",
    totalEarnings: 22.15,
    monthlyEarnings: 4.2,
    hotkey: "5Grwvae...5jMakd",
    coldkey: "5FHneW...xPBqk9",
    uid: 56,
    registeredAt: "2025-07-10",
    lastSeen: "2026-02-07",
  },
  {
    id: "miner-007",
    name: "LuandaGPU",
    ownerName: "Carlos Silva",
    ownerEmail: "carlos@luandagpu.ao",
    location: "Luanda, Angola",
    resourceCount: 1,
    status: "inactive",
    totalEarnings: 0.42,
    monthlyEarnings: 0,
    hotkey: "5EPMpXd...kvZWFG",
    coldkey: "5DfhGyQ...CxjChR",
    uid: 498,
    registeredAt: "2026-01-15",
    lastSeen: "2026-02-05",
  },
  {
    id: "miner-008",
    name: "KampalaNet",
    ownerName: "David Ssempa",
    ownerEmail: "david@kampalanet.ug",
    location: "Kampala, Uganda",
    resourceCount: 1,
    status: "suspended",
    totalEarnings: 1.23,
    monthlyEarnings: 0,
    hotkey: "5GVimUa...HnkuPM",
    coldkey: "5CUqfca...MWv7AN",
    uid: 276,
    registeredAt: "2025-10-20",
    lastSeen: "2026-01-20",
  },
  {
    id: "miner-009",
    name: "AbujaMiner",
    ownerName: "Ibrahim Musa",
    ownerEmail: "ibrahim@abujaminer.ng",
    location: "Abuja, Nigeria",
    resourceCount: 1,
    status: "active",
    totalEarnings: 4.56,
    monthlyEarnings: 0.7,
    hotkey: "5CB6Grw...5NQdgm",
    coldkey: "5CFHnew...PBqk91",
    uid: 355,
    registeredAt: "2025-11-08",
    lastSeen: "2026-02-06",
  },
  {
    id: "miner-010",
    name: "DarGPU",
    ownerName: "Juma Mwangi",
    ownerEmail: "juma@dargpu.tz",
    location: "Dar es Salaam, Tanzania",
    resourceCount: 1,
    status: "suspended",
    totalEarnings: 0.88,
    monthlyEarnings: 0,
    hotkey: "5FLSigC...GN3wxY",
    coldkey: "5Ew2MV...FqTdPZ",
    uid: 189,
    registeredAt: "2025-10-15",
    lastSeen: "2026-01-18",
  },
];

const statusBadgeVariant: Record<MinerStatus, "success" | "destructive" | "default"> = {
  active: "success",
  suspended: "destructive",
  inactive: "default",
};

export default function AdminMinersPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-deep-moss">Miner Management</h1>
        <p className="mt-1 text-muted-foreground">
          {mockMiners.length} registered miners across the network.
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-fern/10 p-2">
                <Pickaxe className="h-5 w-5 text-fern" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {mockMiners.filter((m) => m.status === "active").length}
                </p>
                <p className="text-xs text-muted-foreground">Active Miners</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-copper/10 p-2">
                <Wallet className="h-5 w-5 text-copper" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {mockMiners.reduce((sum, m) => sum + m.totalEarnings, 0).toFixed(2)} TAO
                </p>
                <p className="text-xs text-muted-foreground">Total Earnings</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-forest/10 p-2">
                <Server className="h-5 w-5 text-forest" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {mockMiners.reduce((sum, m) => sum + m.resourceCount, 0)}
                </p>
                <p className="text-xs text-muted-foreground">Total Resources</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Owner</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Resources</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Earnings</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Bittensor UID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockMiners.map((miner) => (
                  <>
                    <tr
                      key={miner.id}
                      onClick={() => setExpandedId(expandedId === miner.id ? null : miner.id)}
                      className="cursor-pointer border-b border-border transition-colors hover:bg-mist/50"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Pickaxe className="h-4 w-4 text-forest" />
                          <span className="font-medium text-foreground">{miner.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{miner.ownerName}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" />
                          {miner.location}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-foreground">{miner.resourceCount}</td>
                      <td className="px-4 py-3">
                        <Badge variant={statusBadgeVariant[miner.status]}>{miner.status}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">
                            {miner.totalEarnings.toFixed(2)} TAO
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {miner.monthlyEarnings > 0
                              ? `+${miner.monthlyEarnings.toFixed(2)} this month`
                              : "No earnings this month"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                        UID {miner.uid}
                      </td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1">
                          <button
                            className="rounded p-1 text-muted-foreground transition-colors hover:bg-mist hover:text-foreground"
                            title="View Resources"
                          >
                            <Server className="h-4 w-4" />
                          </button>
                          <button
                            className="rounded p-1 text-muted-foreground transition-colors hover:bg-mist hover:text-foreground"
                            title="View Earnings"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {miner.status !== "suspended" && (
                            <button
                              className="rounded p-1 text-muted-foreground transition-colors hover:bg-red-900/20 hover:text-red-400"
                              title="Suspend Miner"
                            >
                              <Ban className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    {expandedId === miner.id && (
                      <tr key={`${miner.id}-expanded`} className="border-b border-border">
                        <td colSpan={8} className="bg-mist/30 px-8 py-4">
                          <div className="grid gap-4 sm:grid-cols-4">
                            <div>
                              <p className="text-xs font-medium uppercase text-muted-foreground">Email</p>
                              <p className="mt-1 text-sm text-foreground">{miner.ownerEmail}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium uppercase text-muted-foreground">Hotkey</p>
                              <p className="mt-1 font-mono text-xs text-foreground">{miner.hotkey}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium uppercase text-muted-foreground">Coldkey</p>
                              <p className="mt-1 font-mono text-xs text-foreground">{miner.coldkey}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium uppercase text-muted-foreground">Registered</p>
                              <p className="mt-1 text-sm text-foreground">{miner.registeredAt}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium uppercase text-muted-foreground">Last Seen</p>
                              <p className="mt-1 text-sm text-foreground">{miner.lastSeen}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium uppercase text-muted-foreground">Monthly Earnings</p>
                              <p className="mt-1 text-sm font-medium text-fern">
                                {miner.monthlyEarnings.toFixed(2)} TAO
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-medium uppercase text-muted-foreground">Total Earnings</p>
                              <p className="mt-1 text-sm font-medium text-foreground">
                                {miner.totalEarnings.toFixed(2)} TAO
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-medium uppercase text-muted-foreground">Miner ID</p>
                              <p className="mt-1 font-mono text-xs text-muted-foreground">{miner.id}</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
