import { content } from "@/content";
import { Container } from "../ui/Container";

export function Footer() {
  const { footer } = content;
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line py-8">
      <Container className="flex flex-col gap-2 text-sm text-muted md:flex-row md:items-center md:justify-between">
        <p>{`© ${year} ${footer.owner}`}</p>
        <p>{footer.legal}</p>
      </Container>
    </footer>
  );
}
