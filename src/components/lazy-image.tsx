import * as React from "react";
import { normalizeUrl } from "notion-utils";
import { useNotionContext } from "../context";
import { cs } from "../utils";

/**
 * 懒加载图片组件
 * 支持渐进式加载和模糊效果
 */
export const LazyImage: React.FC<{
  src?: string; // 图片源地址
  alt?: string; // 替代文本
  className?: string; // CSS类名
  style?: React.CSSProperties; // 样式对象
  height?: number; // 图片高度
  zoomable?: boolean; // 是否可缩放
  priority?: boolean; // 是否优先加载
}> = ({ src, alt, className, style, zoomable = false, priority = false, height, ...rest }) => {
  const { recordMap, zoom, previewImages, forceCustomImages, components } = useNotionContext();

  const [isLoaded, setIsLoaded] = React.useState(false);
  const zoomRef = React.useRef(zoom ? zoom.clone() : null);

  const previewImage = previewImages
    ? (recordMap?.preview_images?.[src] ?? recordMap?.preview_images?.[normalizeUrl(src)])
    : null;

  const onLoad = React.useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      setIsLoaded(true);
      if (zoomable && e.currentTarget.src) {
        if (zoomRef.current) {
          (zoomRef.current as any).attach(e.currentTarget);
        }
      }
    },
    [zoomRef, zoomable]
  );

  const attachZoom = React.useCallback(
    (image: HTMLImageElement | null) => {
      if (zoomRef.current && image) {
        (zoomRef.current as any).attach(image);
      }
    },
    [zoomRef]
  );

  const attachZoomRef = React.useMemo(
    () => (zoomable ? attachZoom : undefined),
    [zoomable, attachZoom]
  );

  if (previewImage) {
    const aspectRatio = previewImage.originalHeight / previewImage.originalWidth;

    if (components.Image) {
      return (
        <components.Image
          src={src}
          alt={alt}
          style={style}
          className={className}
          width={previewImage.originalWidth}
          height={previewImage.originalHeight}
          blurDataURL={previewImage.dataURIBase64}
          placeholder="blur"
          priority={priority}
          onLoad={onLoad}
        />
      );
    }

    const wrapperStyle: React.CSSProperties = {
      width: "100%",
    };
    const imgStyle: React.CSSProperties = {};

    if (height) {
      wrapperStyle.height = height;
    } else {
      imgStyle.position = "absolute";
      wrapperStyle.paddingBottom = `${aspectRatio * 100}%`;
    }

    return (
      <div
        className={cs("lazy-image-wrapper", isLoaded && "lazy-image-loaded", className)}
        style={wrapperStyle}
      >
        <img
          className="lazy-image-preview"
          src={previewImage.dataURIBase64}
          alt={alt}
          style={style}
          decoding="async"
        />

        <img
          className="lazy-image-real"
          src={src}
          alt={alt}
          ref={attachZoomRef}
          style={{
            ...style,
            ...imgStyle,
            opacity: isLoaded ? 1 : 0,
            transition: "opacity 0.2s ease-in-out",
          }}
          width={previewImage.originalWidth}
          height={previewImage.originalHeight}
          decoding="async"
          loading="lazy"
          onLoad={onLoad}
        />
      </div>
    );
  } else {
    if (components.Image && forceCustomImages) {
      return (
        <components.Image
          src={src}
          alt={alt}
          className={className}
          style={style}
          width={null}
          height={height || null}
          priority={priority}
          onLoad={onLoad}
        />
      );
    }

    return (
      <img
        className={className}
        style={style}
        src={src}
        alt={alt}
        ref={attachZoomRef}
        loading="lazy"
        decoding="async"
        onLoad={onLoad}
        {...rest}
      />
    );
  }
};
