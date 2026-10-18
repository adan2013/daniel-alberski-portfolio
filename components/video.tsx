export function Video({
  id,
  title,
  caption,
}: {
  id: string;
  title: string;
  caption: string;
}) {
  return (
    <figure className="video">
      <iframe
        className="aspect-video w-full border-0"
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        title={title}
        loading="eager"
        allow="encrypted-media; picture-in-picture"
        allowFullScreen
      />
      <figcaption className="mt-3 text-[12px] text-muted">{caption}</figcaption>
    </figure>
  );
}
