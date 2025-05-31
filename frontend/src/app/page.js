import SubmitNews from "../components/SubmitNews";
import NewsList from "../components/NewsList";
import VoteNews from "../components/VoteNews";




export default function Home() {
  return (
    <div style={{ padding: "2rem" }}>
      <SubmitNews />
      <hr/>
      <VoteNews />
      <hr />
      <NewsList/>
    </div>
  );
}
