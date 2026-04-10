import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Avatar from "../../components/admin/Avatar";
import StatusBadge from "../../components/admin/StatusBadge";
import MiniBarChart from "../../components/admin/MiniBarChart";

const { width: SW } = Dimensions.get("window");

// ─── MOCK DATA ─────────────────────────────────────────────
const STATS = {
  total_users: 13,
  active_users: 7,
  new_this_week: 2,
  total_artists: 5,
  total_bookings: 24,
  total_revenue: 292320,
};

const WEEKLY_REVENUE = [41000, 58000, 37000, 72000, 65000, 89000, 106000];
const WEEKLY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const BOOKING_TREND = [4, 6, 5, 8, 7, 9, 11];

const RECENT_BOOKINGS = [
  {
    id: "1",
    customer: "Priya Sharma",
    service: "Bridal Makeup",
    artist: "Meena K.",
    status: "Confirmed",
    time: "2 hrs ago",
    amount: "₹29,500",
    statusColor: "#22c55e",
  },
  {
    id: "2",
    customer: "Ananya R.",
    service: "Party Makeup",
    artist: "Sai V.",
    status: "Pending",
    time: "5 hrs ago",
    amount: "₹10,000",
    statusColor: "#f59e0b",
  },
  {
    id: "3",
    customer: "Divya M.",
    service: "Hair Styling",
    artist: "Aishwarya",
    status: "Completed",
    time: "1 day ago",
    amount: "₹6,700",
    statusColor: "#3b82f6",
  },
  {
    id: "4",
    customer: "Kavitha N.",
    service: "Engagement Look",
    artist: "Meena K.",
    status: "Pending",
    time: "1 day ago",
    amount: "₹21,000",
    statusColor: "#f59e0b",
  },
];

const TOP_ARTISTS = [
  { id: "1", name: "Meena K.", bookings: 12, rating: 4.9, revenue: "₹1,51,200", pct: 100 },
  { id: "2", name: "Sai Veeranna", bookings: 8, rating: 4.7, revenue: "₹82,300", pct: 54 },
  { id: "3", name: "Aishwarya", bookings: 4, rating: 4.5, revenue: "₹58,800", pct: 39 },
];

const QUICK_ACTIONS = [
  { icon: "person-add-outline", label: "Add User", color: "#3b82f6", bg: "#1e3a5f" },
  { icon: "brush-outline", label: "Add Artist", color: "#a855f7", bg: "#2e1b4e" },
  { icon: "cut-outline", label: "Add Service", color: "#f59e0b", bg: "#3d2c0a" },
  { icon: "calendar-outline", label: "Bookings", color: "#06b6d4", bg: "#0a2e35" },
  { icon: "star-outline", label: "Reviews", color: "#ef4444", bg: "#3d0f0f" },
  { icon: "card-outline", label: "Payments", color: "#22c55e", bg: "#0f2d1a" },
];

// ─── HELPERS ───────────────────────────────────────────────
const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
};

const formatLargeNumber = (n: number) => {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`;
  return `₹${n}`;
};

// ─── ANIMATED STAT CARD ─────────────────────────────────────
function StatCard({
  title,
  value,
  icon,
  iconColor,
  iconBg,
  trend,
  trendPositive,
  delay = 0,
}: {
  title: string;
  value: string | number;
  icon: string;
  iconColor: string;
  iconBg: string;
  trend?: string;
  trendPositive?: boolean;
  delay?: number;
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.statCard,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <View style={[styles.statIconWrap, { backgroundColor: iconBg }]}>
        <Ionicons name={icon as any} size={18} color={iconColor} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      {trend && (
        <View style={styles.trendRow}>
          <Ionicons
            name={trendPositive ? "trending-up" : "trending-down"}
            size={12}
            color={trendPositive ? "#22c55e" : "#ef4444"}
          />
          <Text
            style={[
              styles.trendText,
              { color: trendPositive ? "#22c55e" : "#ef4444" },
            ]}
          >
            {trend}
          </Text>
        </View>
      )}
    </Animated.View>
  );
}

// ─── BOOKING CARD ───────────────────────────────────────────
function BookingCard({ b }: { b: (typeof RECENT_BOOKINGS)[0] }) {
  const statusColorMap: Record<string, string> = {
    Confirmed: "#22c55e",
    Pending: "#f59e0b",
    Completed: "#3b82f6",
    Cancelled: "#ef4444",
  };
  const leftColor = statusColorMap[b.status] ?? "#475569";

  return (
    <View style={styles.bookingCard}>
      {/* Colored left accent */}
      <View style={[styles.bookingAccent, { backgroundColor: leftColor }]} />
      <View style={styles.bookingInner}>
        <View style={styles.bookingLeft}>
          <Avatar name={b.customer} size={42} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.bookingCustomer}>{b.customer}</Text>
            <Text style={styles.bookingService}>{b.service}</Text>
            <View style={styles.bookingArtistRow}>
              <Ionicons name="brush-outline" size={10} color="#64748b" />
              <Text style={styles.bookingArtist}> {b.artist}</Text>
            </View>
          </View>
        </View>
        <View style={styles.bookingRight}>
          <Text style={styles.bookingAmount}>{b.amount}</Text>
          <StatusBadge status={b.status} />
          <View style={styles.bookingTimeRow}>
            <Ionicons name="time-outline" size={10} color="#64748b" />
            <Text style={styles.bookingTime}> {b.time}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

// ─── ARTIST RANK CARD ───────────────────────────────────────
function ArtistRankCard({
  a,
  index,
}: {
  a: (typeof TOP_ARTISTS)[0];
  index: number;
}) {
  const rankColors = ["#f59e0b", "#94a3b8", "#cd7c33"];
  const rankColor = rankColors[index] ?? "#475569";

  return (
    <View style={styles.artistCard}>
      <View style={[styles.rankBadge, { backgroundColor: rankColor + "22" }]}>
        <Text style={[styles.rankText, { color: rankColor }]}>
          #{index + 1}
        </Text>
      </View>
      <Avatar name={a.name} size={40} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.artistName}>{a.name}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((s) => (
              <Ionicons
                key={s}
                name={s <= Math.floor(a.rating) ? "star" : "star-outline"}
                size={10}
                color="#f59e0b"
              />
            ))}
          </View>
          <Text style={styles.artistRating}>{a.rating}</Text>
          <Text style={styles.artistDot}>·</Text>
          <Text style={styles.artistBookings}>{a.bookings} bookings</Text>
        </View>
        {/* Progress bar */}
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${a.pct}%`, backgroundColor: rankColor },
            ]}
          />
        </View>
      </View>
      <Text style={styles.artistRevenue}>{a.revenue}</Text>
    </View>
  );
}

// ─── MAIN DASHBOARD ─────────────────────────────────────────
export default function DashboardScreen() {
  const insets = useSafeAreaInsets();

  // Header animation
  const headerY = useRef(new Animated.Value(-20)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerY, { toValue: 0, duration: 600, useNativeDriver: true }),
      Animated.timing(headerOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 16 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* ── HEADER ── */}
      <Animated.View
        style={[
          styles.header,
          { opacity: headerOpacity, transform: [{ translateY: headerY }] },
        ]}
      >
        <View>
          <Text style={styles.greeting}>{getGreeting()} 👋</Text>
          <Text style={styles.adminTitle}>Admin Dashboard</Text>
          <Text style={styles.dateText}>
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="notifications-outline" size={20} color="#94a3b8" />
            <View style={styles.notifDot} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="settings-outline" size={20} color="#94a3b8" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* ── REVENUE HERO CARD ── */}
      <View style={styles.revenueCard}>
        {/* Glow overlay */}
        <View style={styles.revenueGlow} />
        <View style={styles.revenueTop}>
          <View>
            <Text style={styles.revenueMeta}>Total Revenue</Text>
            <Text style={styles.revenueValue}>
              {formatLargeNumber(STATS.total_revenue)}
            </Text>
            <View style={styles.revenueGrowthRow}>
              <View style={styles.revenueGrowthBadge}>
                <Ionicons name="trending-up" size={12} color="#22c55e" />
                <Text style={styles.revenueGrowthText}>+12% this week</Text>
              </View>
            </View>
          </View>
          <View style={styles.revenueIconWrap}>
            <Ionicons name="cash" size={28} color="#3b82f6" />
          </View>
        </View>
        <MiniBarChart
          data={WEEKLY_REVENUE}
          labels={WEEKLY_LABELS}
          color="#3b82f6"
          height={64}
        />
      </View>

      {/* ── STATS GRID ── */}
      <Text style={styles.sectionTitle}>Overview</Text>
      <View style={styles.statsGrid}>
        <StatCard
          title="Total Bookings"
          value={STATS.total_bookings}
          icon="calendar"
          iconColor="#06b6d4"
          iconBg="#0a2e35"
          trend="+5 this week"
          trendPositive
          delay={0}
        />
        <StatCard
          title="Active Users"
          value={STATS.active_users}
          icon="pulse"
          iconColor="#22c55e"
          iconBg="#0f2d1a"
          trend="+2 new"
          trendPositive
          delay={80}
        />
        <StatCard
          title="Total Artists"
          value={STATS.total_artists}
          icon="brush"
          iconColor="#a855f7"
          iconBg="#2e1b4e"
          trend="Stable"
          trendPositive
          delay={160}
        />
        <StatCard
          title="Total Users"
          value={STATS.total_users}
          icon="people"
          iconColor="#f59e0b"
          iconBg="#3d2c0a"
          trend="+16%"
          trendPositive
          delay={240}
        />
      </View>

      {/* ── BOOKING TREND ── */}
      <View style={styles.trendCard}>
        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.trendCardTitle}>Booking Trend</Text>
            <Text style={styles.trendCardSub}>Last 7 days</Text>
          </View>
          <View style={styles.trendUpBadge}>
            <Ionicons name="trending-up" size={12} color="#22c55e" />
            <Text style={styles.trendUpText}>+37.5%</Text>
          </View>
        </View>
        <View style={{ marginTop: 12 }}>
          <MiniBarChart
            data={BOOKING_TREND}
            labels={WEEKLY_LABELS}
            color="#22c55e"
            height={50}
          />
        </View>
      </View>

      {/* ── RECENT BOOKINGS ── */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Bookings</Text>
        <TouchableOpacity style={styles.viewAllBtn}>
          <Text style={styles.viewAllText}>View All</Text>
          <Ionicons name="chevron-forward" size={14} color="#3b82f6" />
        </TouchableOpacity>
      </View>
      {RECENT_BOOKINGS.map((b) => (
        <BookingCard key={b.id} b={b} />
      ))}

      {/* ── TOP ARTISTS ── */}
      <View style={[styles.sectionHeader, { marginTop: 8 }]}>
        <Text style={styles.sectionTitle}>Top Artists</Text>
        <TouchableOpacity style={styles.viewAllBtn}>
          <Text style={styles.viewAllText}>View All</Text>
          <Ionicons name="chevron-forward" size={14} color="#3b82f6" />
        </TouchableOpacity>
      </View>
      <View style={styles.topArtistsCard}>
        {TOP_ARTISTS.map((a, i) => (
          <React.Fragment key={a.id}>
            <ArtistRankCard a={a} index={i} />
            {i < TOP_ARTISTS.length - 1 && <View style={styles.divider} />}
          </React.Fragment>
        ))}
      </View>

      {/* ── QUICK ACTIONS ── */}
      <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Quick Actions</Text>
      <View style={styles.actionsGrid}>
        {QUICK_ACTIONS.map((action) => (
          <TouchableOpacity
            key={action.label}
            style={styles.actionBtn}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.actionIconWrap,
                { backgroundColor: action.bg },
              ]}
            >
              <Ionicons
                name={action.icon as any}
                size={22}
                color={action.color}
              />
            </View>
            <Text style={styles.actionLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* bottom padding */}
      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

// ─── STYLES ─────────────────────────────────────────────────
const CARD_BG = "#141e30";
const CARD_BORDER = "rgba(255,255,255,0.06)";

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0b1120",
  },
  content: {
    paddingHorizontal: 20,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  greeting: {
    fontSize: 13,
    color: "#64748b",
    marginBottom: 2,
  },
  adminTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#f8fafc",
    letterSpacing: -0.5,
  },
  dateText: {
    fontSize: 12,
    color: "#475569",
    marginTop: 2,
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    alignItems: "center",
    justifyContent: "center",
  },
  notifDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ef4444",
    borderWidth: 1.5,
    borderColor: "#0b1120",
  },

  // Revenue Hero Card
  revenueCard: {
    backgroundColor: "#0d1b2e",
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(59,130,246,0.2)",
    overflow: "hidden",
  },
  revenueGlow: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(59,130,246,0.08)",
  },
  revenueTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  revenueMeta: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  revenueValue: {
    fontSize: 38,
    fontWeight: "800",
    color: "#f8fafc",
    letterSpacing: -1,
  },
  revenueGrowthRow: {
    flexDirection: "row",
    marginTop: 6,
  },
  revenueGrowthBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(34,197,94,0.12)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  revenueGrowthText: {
    fontSize: 11,
    color: "#22c55e",
    fontWeight: "600",
  },
  revenueIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "rgba(59,130,246,0.12)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(59,130,246,0.2)",
  },

  // Stats Grid
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    width: (SW - 52) / 2,
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: CARD_BORDER,
  },
  statIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "800",
    color: "#f8fafc",
    letterSpacing: -0.5,
  },
  statTitle: {
    fontSize: 11,
    color: "#64748b",
    marginTop: 2,
    fontWeight: "500",
  },
  trendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 6,
  },
  trendText: {
    fontSize: 10,
    fontWeight: "600",
  },

  // Trend Card
  trendCard: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: CARD_BORDER,
  },
  trendCardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#f1f5f9",
  },
  trendCardSub: {
    fontSize: 11,
    color: "#475569",
    marginTop: 2,
  },
  trendUpBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(34,197,94,0.12)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  trendUpText: {
    fontSize: 11,
    color: "#22c55e",
    fontWeight: "700",
  },

  // Section Header
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#f1f5f9",
    marginBottom: 12,
  },
  viewAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 12,
    color: "#3b82f6",
    fontWeight: "600",
  },

  // Booking Card
  bookingCard: {
    flexDirection: "row",
    backgroundColor: CARD_BG,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    overflow: "hidden",
  },
  bookingAccent: {
    width: 3.5,
  },
  bookingInner: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
  },
  bookingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  bookingCustomer: {
    fontSize: 13,
    fontWeight: "700",
    color: "#f1f5f9",
  },
  bookingService: {
    fontSize: 11,
    color: "#94a3b8",
    marginTop: 2,
  },
  bookingArtistRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },
  bookingArtist: {
    fontSize: 10,
    color: "#64748b",
  },
  bookingRight: {
    alignItems: "flex-end",
    gap: 4,
  },
  bookingAmount: {
    fontSize: 14,
    fontWeight: "800",
    color: "#f8fafc",
  },
  bookingTimeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  bookingTime: {
    fontSize: 10,
    color: "#475569",
  },

  // Top Artists Card
  topArtistsCard: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    overflow: "hidden",
    marginBottom: 8,
  },
  artistCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  rankBadge: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  rankText: {
    fontSize: 11,
    fontWeight: "800",
  },
  artistName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#f1f5f9",
    marginBottom: 3,
  },
  starsRow: {
    flexDirection: "row",
    gap: 1,
  },
  artistRating: {
    fontSize: 10,
    color: "#f59e0b",
    fontWeight: "700",
  },
  artistDot: {
    color: "#334155",
    fontSize: 10,
  },
  artistBookings: {
    fontSize: 10,
    color: "#64748b",
  },
  progressTrack: {
    height: 3,
    backgroundColor: "#1e293b",
    borderRadius: 2,
    marginTop: 6,
    overflow: "hidden",
  },
  progressFill: {
    height: 3,
    borderRadius: 2,
  },
  artistRevenue: {
    fontSize: 13,
    fontWeight: "800",
    color: "#22c55e",
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    marginHorizontal: 16,
  },

  // Row helper
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  // Quick Actions
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 8,
  },
  actionBtn: {
    width: (SW - 60) / 3,
    backgroundColor: CARD_BG,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: CARD_BORDER,
  },
  actionIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: {
    fontSize: 10,
    color: "#94a3b8",
    fontWeight: "600",
    textAlign: "center",
  },
});