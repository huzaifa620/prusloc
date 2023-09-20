import TextHeader from "../components/TextHeader";
import DatabaseTable from "../components/DatabaseTable"

export default function Database() {
  return (
    <div className="flex flex-col space-y-4">
        <TextHeader title="Database"/>
        <div className="p-4">
          <DatabaseTable />
        </div>
    </div>
  )
}
