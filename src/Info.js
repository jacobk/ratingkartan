import { Grid, Link, Typography } from "@mui/material";
import { styled } from "@mui/styles";

const H1 = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const H2 = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1),
}));

const Section = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

export default function Info() {
  return (
    <Grid container sx={{ p: 2 }} spacing={4}>
      <Grid item md={4}>
        <H1 variant="h4">Info</H1>
        <Section variant="body1">
          Ratingkartan sammanställer statisik för aktiva (dvs. betalande)
          svenska PDGA-medlemmar.
        </Section>
        <H2 variant="h5">När uppdateras datan?</H2>
        <Section variant="body1">
          Datan uppdateras automatiskt vid två tillfällen:
          <ul>
            <li>
              Ca. kl 6 på morgonen andra tisdagen i varje månad då PDGA
              uppdaterar allas rating
            </li>
            <li>
              Den siste varje månad. Detta behövs för att fånga upp statistik
              för spelare som betalat in sin PDGA-avgift efter ordinarie
              uppdatering.
            </li>
          </ul>
        </Section>
      </Grid>
      <Grid item md={4}>
        <H1 variant="h4">Hur funkar det?</H1>
        <Section variant="body1">
          Ratingkartan försöker efter bästa förmåga härleda vilken kommun och
          län en spelare bor i baserat på fältet "City" angivet hos PDGA.
        </Section>
        <Section variant="body1">
          Detta är inte helt felfritt. Vanliga fel beror på:
          <ul>
            <li>City är ej angivet på PDGA-profilen</li>
            <li>City är felstavat</li>
            <li>
              I de fall då City inte direkt matchar en kommun försöker
              ratingkartan använda diverse listor på tätorter och postorter med
              följande begränsningar:
              <ul>
                <li>Det finns flera platser med samma namn i Sverige.</li>
                <li>
                  Vissa platser ligger inte entydigt i en kommun eller ett län.
                </li>
                <li>Ratingkartans data är bristfällig.</li>
              </ul>
            </li>
          </ul>
        </Section>
        <Section variant="body1">
          När ratingkartan upptäcker flera platser med samma namn väljer den
          platsen med störst befolkningsmängd.
        </Section>
      </Grid>
      <Grid item md={4}>
        <H1 variant="h4">Hittat fel!</H1>
        <Section variant="body1">
          Skapa en issue här:{" "}
          <Link href="https://github.com/jacobk/ratingkartan/issues">
            https://github.com/jacobk/ratingkartan/issues
          </Link>
        </Section>
        <Section variant="body1">
          Vid behov kan ratingkartan utökas med korrigeringar för individuella
          spelare om det inte går att lösa genom att uppdatera informationen hos
          PDGA.
        </Section>
      </Grid>
    </Grid>
  );
}
