const skeletonStyle = {
  background: 'rgba(13,17,30,0.75)',
  backdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: '14px',
  padding: '16px',
};

const barStyle = (w, h = '10px') => ({
  width: w,
  height: h,
  borderRadius: '6px',
  background: 'linear-gradient(90deg, rgba(91,141,239,0.04) 0%, rgba(91,141,239,0.1) 50%, rgba(91,141,239,0.04) 100%)',
  backgroundSize: '400px 100%',
  animation: 'shimmer 1.8s ease-in-out infinite',
});

export function ListingSkeleton() {
  return (
    <div style={skeletonStyle}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{ width: 38, height: 38, borderRadius: '50%', flexShrink: 0, ...barStyle('38px', '38px') }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={barStyle('120px', '12px')} />
          <div style={barStyle('80px', '10px')} />
        </div>
        <div style={barStyle('56px', '20px', { borderRadius: '100px' })} />
      </div>

      {/* Divider */}
      <div style={{ margin: '14px 0', height: '1px', background: 'rgba(255,255,255,0.05)' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={barStyle('75%', '12px')} />
        <div style={barStyle('100%', '10px')} />
        <div style={barStyle('55%', '10px')} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '14px' }}>
        <div style={barStyle('90px', '10px')} />
        <div style={barStyle('60px', '10px')} />
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={skeletonStyle}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', flexShrink: 0, ...barStyle('52px', '52px') }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '4px' }}>
            <div style={barStyle('160px', '14px')} />
            <div style={barStyle('100px', '11px')} />
          </div>
        </div>
        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ ...barStyle('100%', '44px'), borderRadius: '12px' }} />
          <div style={{ ...barStyle('100%', '44px'), borderRadius: '12px' }} />
        </div>
      </div>
      <div style={{ ...skeletonStyle, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={barStyle('80px', '11px')} />
        <div style={barStyle('100%', '12px')} />
        <div style={barStyle('70%', '12px')} />
      </div>
    </div>
  );
}
