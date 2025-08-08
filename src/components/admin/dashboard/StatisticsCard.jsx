export default function StatisticsCard({ cardDetails }) {
  let data = cardDetails;
  return (
    <>
      <Card key={data.title}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">{data.title}</CardTitle>
          <card.icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.value}</div>
          <p className="text-xs text-muted-foreground">{data.change}</p>
        </CardContent>
      </Card>
    </>
  );
}
