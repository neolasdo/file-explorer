export function formatSize(num, MAX) {
  let suffix, d = num;
  if ((d / 1073741824) >= 1) {
    d = d / 1073741824;
    d = MAX > 21474836480 ? Math.ceil(d) : d.toFixed(2);
    suffix = " GB"
  } else if ((d / 1048576) >= 1) {
    d = d / 1048576
    d = MAX > 20971520 ? Math.ceil(d) : d.toFixed(1)
    suffix = " MB";
  } else if ((d / 1024) >= 1) {
    d = d / 1024;
    d = MAX > 20480  ? Math.ceil(d): d.toFixed(1)
    suffix = " KB";
  } else {
    d = Math.ceil(d);
    suffix = " Bytes";
  }
  return d + suffix;
}
