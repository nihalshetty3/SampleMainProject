public class t{
    public static void helper(int arr[])
    {
        System.out.println("First element is:" + " "+ arr[0]);
        System.out.println("Second element is:" + " "+ arr[1]);
    }
    public static void main(String args[])
    {
        System.out.println("Test webhook trigger for Github action");
        System.out.println("Latest trigger check");
    }
    public static int binSearch(int nums[], int target)
    {
        int low=0, high=nums.length-1;
        while(low <= high)
        {
            int mid = low + (high-low)/2;
            if(nums[mid]==target)
            {
                return mid;
            }
            else if(nums[mid] < taret)
            {
                low++;
            }
            else
            {
                high--;
            }
        }
        return -1;
    }
}