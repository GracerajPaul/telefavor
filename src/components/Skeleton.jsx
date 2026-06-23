const skeletonBar = (w, h = "10px") => ({
  width: w, height: h, borderRadius: "6px",
  background: "rgba(255,255,255,0.04)",
});

export function ListingSkeleton() {
  return (
    <div className="bg-bg-card border border-border rounded-xl p-4">
      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
        <div style={{ width: 38, height: 38, borderRadius: "50%", flexShrink: 0, background: "rgba(255,255,255,0.04)" }} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px", paddingTop: "6px" }}>
          <div style={skeletonBar("120px", "12px")} />
          <div style={skeletonBar("80px", "10px")} />
        </div>
      </div>
      <div style={{ margin: "14px 0", height: "1px", background: "rgba(255,255,255,0.06)" }} />
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <div style={skeletonBar("75%", "12px")} />
        <div style={skeletonBar("100%", "10px")} />
        <div style={skeletonBar("55%", "10px")} />
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <div className="bg-bg-card border border-border rounded-xl p-4">
        <div style={{ display: "flex", gap: "16px" }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", flexShrink: 0, background: "rgba(255,255,255,0.04)" }} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px", paddingTop: "4px" }}>
            <div style={skeletonBar("160px", "14px")} />
            <div style={skeletonBar("100px", "11px")} />
          </div>
        </div>
        <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ ...skeletonBar("100%", "44px"), borderRadius: "12px" }} />
        </div>
      </div>
    </div>
  );
}
